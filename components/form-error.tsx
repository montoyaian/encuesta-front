type FormErrorProps = {
  error?: string[];
};

export function FormError({ error }: FormErrorProps) {
  if (!error || error.length === 0) {
    return null;
  }

  return <p className="mt-1 text-sm text-red-600">{error[0]}</p>;
}
