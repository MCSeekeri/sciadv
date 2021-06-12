const { getAssetFromKV } = require('kv4cf');

addEventListener('fetch', (event) => {
    try {
        event.respondWith(handleEvent(event));
    } catch (e) {
        event.respondWith(new Response('Internal Error', { status: 500 }));
    }
});

async function handleEvent(event) {
    const url = new URL(event.request.url);
    const { origin, pathname: path, search } = new URL(event.request.url);
    let options = {};

    try {
        // 将 `/index.html` 结尾的请求重定向至 `/`
        if (path.endsWith('/index.html')) {
            return new Response(null, {
                status: 301,
                headers: {
                    Location: `${origin}${path.substring(0, path.length - 10)}${search}`,
                    'Cache-Control': 'max-age=3600',
                },
            });
        }

        // CSS 文件超长时间缓存
        if (path.startsWith('/css/')) {
            const response = await getAssetFromKV(event, {
                cacheControl: {
                    edgeTtl: 365 * 24 * 60 * 60,
                    browserTtl: 30 * 24 * 60 * 60,
                    cacheEverything: true,
                },
            });
            response.headers.set('cache-control', `public, max-age=${365 * 24 * 60 * 60}, immutable`);
            return response;
        }

        // 其余默认 4 小时 CDN 缓存、1 小时浏览器缓存
        const response = await getAssetFromKV(event, {
            cacheControl: {
                edgeTtl: 4 * 60 * 60,
                browserTtl: 60 * 60,
                cacheEverything: true,
            },
        });

        response.headers.set('X-XSS-Protection', '1; mode=block');


        return response;
    } catch (e) {
        // 未找到资源，返回 404 页面
        let notFoundResponse = await getAssetFromKV(event, {
            mapRequestToAsset: (req) => new Request(`${new URL(req.url).origin}/404.html`, req),
        });

        return new Response(notFoundResponse.body, { ...notFoundResponse, status: 404 });
    }
}