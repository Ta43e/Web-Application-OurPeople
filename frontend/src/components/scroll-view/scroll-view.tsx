import { FC, HtmlHTMLAttributes, ReactNode, memo, useEffect, useRef } from "react";
import { ScrollViewContainer } from "./scroll-view.styled";

export type ScrollViewProps = {
    children?: ReactNode;
    isAutoScroll?: boolean;
} & HtmlHTMLAttributes<HTMLElement>;

export const ScrollView: FC<ScrollViewProps> = memo(({ isAutoScroll = false ,children, ...rest }) => {

    const scrollViewRef = useRef<HTMLDivElement>(null);

    useEffect(()=> {
        if(!isAutoScroll) return;
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTop = scrollViewRef.current.scrollHeight;
        }
    }, [children,isAutoScroll]);

    return (
        <ScrollViewContainer ref={scrollViewRef} {...rest}>
            {children}
        </ScrollViewContainer>
    );
});