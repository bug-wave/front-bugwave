'use client';

import { useEffect, useRef } from 'react';

interface WebViewerProps {
    pdfUrl: string
}

export default function WebViewer({pdfUrl}: WebViewerProps) {

    const viewer = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!viewer.current) return
        import('@pdftron/webviewer').then((module) => {
            const WebViewer = module.default;
            WebViewer(
                {
                    path: '/lib', // sign up to get a key at https://dev.apryse.com
                    initialDoc: pdfUrl,
                },
                viewer.current as HTMLDivElement,
            )
        })
    }, []);


    return (
        <div className="w-[30%]">
            <div className="webviewer" ref={viewer} style={{height: "100vh"}}></div>
        </div>

    );

}