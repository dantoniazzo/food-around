interface ErrorMessageProps {
  children: string;
}

export const ErrorMessage = (props: ErrorMessageProps) => {
  return <span className="text-red-700 text-sm mt-2">{props.children}</span>;
};
