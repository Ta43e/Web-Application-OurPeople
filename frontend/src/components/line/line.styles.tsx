import styled from "styled-components";

export type StyledLineProps = {
  height?: number;
  width?: number;
  color?: string;
};

export const StyledLine = styled.div<StyledLineProps>`
  padding: 0;
  margin: 0;
  width: ${props => props.width ? props.width + "px" : "100%"};
  height: ${props => props.height ? props.height + "px" : "100%"};
  background-color: ${props => props.color ? props.color : "transparent"};
`;
