import { cn } from "@/lib/utils";
import remarkGfm from "remark-gfm";
import { MDXRemote, MDXRemoteProps } from "next-mdx-remote/rsc";

export const markdownClassNames =
  "max-w-none prose prose-neutral dark:prose-invert font-sans";

export const MarkdownRenderer = ({
  className,
  options,
  ...props
}: MDXRemoteProps & { className?: string }) => {
  return (
    <div className={cn(markdownClassNames, className)}>
      <MDXRemote
        {...props}
        options={{
          mdxOptions: {
            remarkPlugins: [
              remarkGfm,
              ...(options?.mdxOptions?.remarkPlugins ?? []),
            ],
            ...options?.mdxOptions,
          },
        }}
      />
    </div>
  );
};
