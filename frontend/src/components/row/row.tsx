import { FC, HtmlHTMLAttributes, ReactNode, memo } from "react";
import { RowContainer } from "./row.styles";

export type RowProps = {
    horizontalAlign?: "flex-start" | "center" | "flex-end" | "space-between";
    verticalAlign?: "flex-start" | "center" | "flex-end" | "space-between" | "space-around";
    padding?: number | [number?, number?, number?, number?];
    children?: ReactNode;
    width?: number | string;
    height?: number | string;
    color?: string;
  } & HtmlHTMLAttributes<HTMLElement>;

export const Row: FC<RowProps> = memo(({ color, verticalAlign, horizontalAlign, width, height, padding, children, ...rest }) => 
    <RowContainer color={color} width={width} height={height} padding={padding} vertical={verticalAlign} horizontal={horizontalAlign} {...rest}>{children}</RowContainer>
);
  