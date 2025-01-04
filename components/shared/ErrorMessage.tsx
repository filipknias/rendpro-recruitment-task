type Props = {
    message: string;
}

export default function ErrorMessage({ message }: Props) {
    return (
        <div className="rounded-md bg-red-100 p-5 text-red-500 font-medium mb-4">
            {message}
        </div>
    )
}
