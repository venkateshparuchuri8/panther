import React, { Component } from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';
import {convertFromHTML} from 'draft-convert';


class RWBEditor extends Component {
  constructor(props) {
    super(props);
    if(this.props.value){
      this.state = {
        editorState: EditorState.createWithContent(convertFromHTML(this.props.value))
      };
    }
    else{
      this.state = {
        editorState: EditorState.createEmpty()
      };
    }

    this.focus = () => this.refs.editor.focus();
    this.onChange = this.onChange.bind(this);

    this.handleKeyCommand = (command) => this._handleKeyCommand(command);
    this.onTab = (e) => this._onTab(e);
    this.toggleBlockType = (type) => this._toggleBlockType(type);
    this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);
  }

  componentDidMount() {
    if(this.props.value) {
      this.setState({
        editorState: EditorState.createWithContent(convertFromHTML(this.props.value))
      })
    }
  }

  componentWillReceiveProps(newProps) {
    if(this.props === newProps) return;
    if(newProps.value) {
      this.setState({
        editorState: EditorState.createWithContent(convertFromHTML(newProps.value))
      })
    }
  }

  onChange(editorState) {
    this.setState({
      editorState: editorState
    });
    this.props.change({
      editorState: editorState
    });
  }

  _handleKeyCommand(command) {
    const {editorState} = this.state;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }

  _onTab(e) {
    const maxDepth = 4;
    this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
  }

  _toggleBlockType(blockType) {
    this.onChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType
      )
    );
  }

  _toggleInlineStyle(inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle
      )
    );
  }

  render() {
    const {editorState} = this.state;

    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    let className = 'RichEditor-editor';
    var contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== 'unstyled') {
        className += ' RichEditor-hidePlaceholder';
      }
    }

    return (
      <div className="RichEditor-root">

              <InlineStyleControls
      editorState={editorState}
      onToggle={this.toggleInlineStyle}
      />
            <BlockStyleControls
      editorState={editorState}
      onToggle={this.toggleBlockType}
      />
              <div className={className} onClick={this.focus}>
                <Editor
      blockStyleFn={getBlockStyle}
      customStyleMap={styleMap}
      editorState={editorState}
      handleKeyCommand={this.handleKeyCommand}
      onChange={this.onChange}
      onTab={this.onTab}
      placeholder="Tell a story..."
      ref="editor"
      spellCheck={true}
      />
              </div>
            </div>
      );
  }

}
// Custom overrides for "code" style.
const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas"',
    fontSize: 16,
    padding: 2,
  },
};

function getBlockStyle(block) {
  switch (block.getType()) {
    case 'blockquote':
      return 'RichEditor-blockquote';
    default:
      return null;
  }
}

class StyleButton extends React.Component {
  constructor() {
    super();
    this.onToggle = (e) => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }

  getIcon(label) {
    switch(label) {
      case 'B':
        return <img src="/assets/editor-bold.svg" width="75%" />;
      case 'I':
        return <img src="/assets/editor-italics.svg" width="75%" />;
      case 'U':
        return <span style={{textDecoration: 'underline'}}>{label}</span>;
      case 'UL':
        return <img src="/assets/editor-ul.svg" />;
      case 'OL':
        return <img src="/assets/editor-ol.svg" />;
      case '"':
        return <img src="/assets/editor-quote.svg" />;
      case 'Block':
        return label;
      default:
        return null;
    }
  }

  render() {
    let className = 'RichEditor-styleButton';
    if (this.props.active) {
      className += ' RichEditor-activeButton';
    }

    return (
      <span className={className} onMouseDown={this.onToggle}>
        {this.getIcon(this.props.label)}
      </span>
      );
  }
}

const BLOCK_TYPES = [
 /* {
    label: 'H1',
    style: 'header-one'
  },
  {
    label: 'H2',
    style: 'header-two'
  },
  {
    label: 'H3',
    style: 'header-three'
  },
  {
    label: 'H4',
    style: 'header-four'
  },
  {
    label: 'H5',
    style: 'header-five'
  },
  {
    label: 'H6',
    style: 'header-six'
  },*/

  {
    label: 'UL',
    style: 'unordered-list-item'
  },
  {
    label: 'OL',
    style: 'ordered-list-item'
  },
  {
    label: '"',
    style: 'blockquote'
  },
  {
    label: 'Block',
    style: 'code-block'
  },
];

const BlockStyleControls = (props) => {
  const {editorState} = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div className="RichEditor-controls">
            {BLOCK_TYPES.map((type) => <StyleButton
      key={type.label}
      active={type.style === blockType}
      label={type.label}
      onToggle={props.onToggle}
      style={type.style}
      />
    )}
          </div>
    );
};

var INLINE_STYLES = [
  {
    label: 'B',
    style: 'BOLD'
  },
  {
    label: 'I',
    style: 'ITALIC'
  },
  {
    label: 'U',
    style: 'UNDERLINE'
  }

];

const InlineStyleControls = (props) => {
  var currentStyle = props.editorState.getCurrentInlineStyle();
  return (
    <div className="RichEditor-controls">
            {INLINE_STYLES.map(type => <StyleButton
      key={type.label}
      active={currentStyle.has(type.style)}
      label={type.label}
      onToggle={props.onToggle}
      style={type.style}
      />
    )}
          </div>
    );
};


export default RWBEditor;
