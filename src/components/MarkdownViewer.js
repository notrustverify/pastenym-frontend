import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import stringWidth from 'string-width'
import rehypeExternalLinks from 'rehype-external-links'


class MarkdownViewer extends React.Component {


    render() {
        
        return (
            <ReactMarkdown
            remarkPlugins={[[gfm,  {stringLength: stringWidth}], remarkBreaks]} rehypePlugins={[[rehypeExternalLinks,{rel: ['nofollow','noopener','noreferer']}]]}
            linkTarget="_blank">

                {this.props.text.replace("    ","")}

            </ReactMarkdown>
        )
    }
}

export default MarkdownViewer
