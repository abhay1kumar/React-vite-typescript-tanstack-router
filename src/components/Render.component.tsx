type Props = {
  if: boolean;
  children: JSX.Element;
};
export const Render = (props: Props): JSX.Element => {
  return props.if ? props.children : <></>;
};
