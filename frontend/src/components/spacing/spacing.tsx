import { FC, HtmlHTMLAttributes, memo } from "react";
import { SpacingStyled } from "./spacing.styles";

export type SpacingProps = {
   themeSpace: number;
   themeMobileSpace?: number;
   variant: "Row" | "Column";
} & HtmlHTMLAttributes<HTMLElement>;

export const Spacing: FC<SpacingProps> = memo(({ themeSpace, variant, themeMobileSpace, ...rest }) => 
<SpacingStyled {...rest} variant={variant} space={themeSpace} mobile={themeMobileSpace ? themeMobileSpace : themeSpace} />
);