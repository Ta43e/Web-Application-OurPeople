import { styled } from "styled-components"
import { theme } from "../../themes/theme";

export const SpacingStyled = styled.div<{
    space: number;
    variant: "Row" | "Column";
    mobile: number;
  }>`
    margin-top: ${(props) =>
      props.variant === "Column" && `${props.space}px`};
    margin-left: ${(props) =>
      props.variant === "Row" && `${props.space}px`};
    @media (max-width: ${theme.toMobileSize + 'px'}) {
      margin-top: ${(props) =>
        props.variant === "Column" && `${props.mobile}px`};
      margin-left: ${(props) =>
        props.variant === "Row" && `${props.mobile}px`};
    }
  `;