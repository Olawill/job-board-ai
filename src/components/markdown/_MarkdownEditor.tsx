"use client";

import { Ref } from "react";
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
  tablePlugin,
  toolbarPlugin,
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  ListsToggle,
  InsertThematicBreak,
  InsertTable,
  UndoRedo,
  CreateLink,
  linkDialogPlugin,
  Separator,
} from "@mdxeditor/editor";
import { cn } from "@/lib/utils";
import { useIsDarkMode } from "@/hooks/useIsDarkMode";
import { markdownClassNames } from "./MarkdownRenderer";

const InternalMarkdownEditor = ({
  ref,
  className,
  ...props
}: MDXEditorProps & { ref?: Ref<MDXEditorMethods> }) => {
  const isDarkMode = useIsDarkMode();

  return (
    <MDXEditor
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        linkDialogPlugin(),
        tablePlugin(),
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <BlockTypeSelect />
              <Separator />
              <BoldItalicUnderlineToggles />
              <Separator />
              <ListsToggle />
              <Separator />
              <InsertThematicBreak />
              <InsertTable />
              <Separator />
              <UndoRedo />
              <Separator />
              <CreateLink />
            </>
          ),
        }),
      ]}
      suppressHtmlProcessing
      ref={ref}
      {...props}
      className={cn(markdownClassNames, isDarkMode && "dark-theme", className)}
    />
  );
};

export default InternalMarkdownEditor;
