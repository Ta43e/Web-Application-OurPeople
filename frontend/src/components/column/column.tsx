import { FC, HtmlHTMLAttributes, ReactNode, memo } from "react";
import { ColumnContainer } from "./column-styles";

export type ColumnProps = {
    horizontalAlign?: "flex-start" | "center" | "flex-end" | "space-between" | "space-around";
    verticalAlign?: "flex-start" | "center" | "flex-end" | "space-between";
    padding?: number | [number?, number?, number?, number?];
    color?: string;
    children?: ReactNode;
} & HtmlHTMLAttributes<HTMLElement>;

export const Column: FC<ColumnProps> = memo(({color, horizontalAlign, verticalAlign, padding, children, ...rest }) => {
    return (
        <ColumnContainer
            padding={padding}
            color={color}
            horizontal={horizontalAlign}
            vertical={verticalAlign}
            {...rest}
        >
            {children}
        </ColumnContainer>
    );
});