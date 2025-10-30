import clsx from "clsx";
import type { PropsWithChildren, ReactNode } from "react";

const PageContainer = ({ header, footer, contentClassName, children }: PropsWithChildren<{ header?: ReactNode, footer?: ReactNode, contentClassName?: string }>) => {
    return (
        <div className="flex flex-col w-full h-full overflow-hidden">
            {header}
            <div className={clsx("flex shrink-1 grow-1 basis-auto overflow-auto", contentClassName)}>
                {children}
            </div>
            {footer}
        </div>
    );
};

export default PageContainer;