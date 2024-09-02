import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { getPosts } from "../api";

function PostButton() {
  const mutation = useMutation<string, Error, void, unknown>({
    mutationFn: getPosts,
  });

  const handleClick = () => {
    mutation.mutate();
  };

  return (
    <>
      <Button onClick={handleClick} disabled={mutation.isPending}>
        {mutation.isPending ? "Loading..." : "Fetch Posts"}
      </Button>
      {mutation.isError && (
        <div>An error occurred: {mutation.error.message}</div>
      )}
      {mutation.isSuccess && <div>{`Posts fetched ${mutation.data}!`}</div>}
    </>
  );
}

export default PostButton;
