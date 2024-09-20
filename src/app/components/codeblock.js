'use server'
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { solarizedlight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { getVariable } from "@/lib/variables";
import { CodeBlockCopy } from "@/app/components/codeblock-copy";

/**
 * A React component that renders a syntax-highlighted code block with the ability to copy its content and optional variable replacement.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.className - The CSS class name for the code block.
 * @param {string} props.children - The code block content containing placeholders.
 * @param {boolean} props.isBlock - Flag indicating if the code block should be rendered as a block element.
 * @param {...Object} props - Additional properties to be passed to the code block.
 * @returns {JSX.Element} - The rendered code block component.
 */
export async function CodeBlock({ className, children, isBlock, ...props }) {

  /**
   * Fetches the value of a variable from the server.
   *
   * @param {string} variable - The name of the variable to fetch.
   * @returns {Promise<string>} - A promise that resolves to the value of the variable.
   */
  const fetchData = async (variable) => {
    if (!variable) return;
    const data = await getVariable(variable);
    return data;
  };

  /**
   * Processes the children string to replace placeholders with fetched variable values.
   *
   * @param {string} children - The code block content containing placeholders.
   * @returns {Promise<string>} - A promise that resolves to the processed code block content.
   */
  const processChildren = async (children) => {
    if (!children || typeof children !== "string") {
      console.error("No children or children is not a string");
      return;
    }
    const regex = /{{(.*?)}}/g;
    let match;
    const promises = [];
    const variables = [];

    while ((match = regex.exec(children)) !== null) {
      variables.push(match[1]);
      promises.push(fetchData(match[1]));
    }

    const results = await Promise.all(promises);
    let newChildData = children;

    variables.forEach((variable, index) => {
      newChildData = newChildData.replace(`{{${variable}}}`, results[index]);
    });

    return newChildData;
  };

  const childData = await processChildren(children);

  if (!isBlock) {
    return (
      <span className="text-solarized-light-gray bg-solarized-light-tan rounded-lg px-2 py-1">
        <code {...props} >
          {children}
        </code>
      </span>
    );
  }

  const language = /language-(\w+)/.exec(className || "");

  return (
    <div className="relative bg-gray-800 rounded-lg">
      <CodeBlockCopy>{childData}</CodeBlockCopy>
      <SyntaxHighlighter
        style={solarizedlight}
        PreTag="div"
        language={language ? language[1] : null}
        {...props}
      >
        {childData}
      </SyntaxHighlighter>
    </div>
  );
}
