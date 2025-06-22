import { cn } from "@/lib/utils";
import remarkGfm from "remark-gfm";
import { MDXRemote, MDXRemoteProps } from "next-mdx-remote/rsc";

import { markdownClassNames } from "./_MarkdownEditor";

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
