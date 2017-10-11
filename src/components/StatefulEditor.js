import React from 'react';
import { debounce } from './../utils';
import RichTextEditor from 'react-rte';
// Be sure to include styles at some point, probably during your bootstrapping
import 'react-select-plus/dist/react-select-plus.css';

const toolbarConfig = {
  // Optionally specify the groups to display (displayed in the order listed).
  display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'BLOCK_TYPE_DROPDOWN', 'HISTORY_BUTTONS'],
  INLINE_STYLE_BUTTONS: [
    { label: 'Жырный', style: 'BOLD', className: 'custom-css-class' },
    { label: 'Курсив', style: 'ITALIC' },
    { label: 'Подчеркнутый', style: 'UNDERLINE' }
  ],
  BLOCK_TYPE_DROPDOWN: [
    { label: 'Нормальный', style: 'unstyled' },
    { label: 'Большое заглявье', style: 'header-one' },
    { label: 'Средние заглявье', style: 'header-two' },
    { label: 'Маленькое заглявье', style: 'header-three' }
  ],
  BLOCK_TYPE_BUTTONS: [
    { label: '', style: 'unordered-list-item' },
    { label: 'OL', style: 'ordered-list-item' }
  ],
  HISTORY_BUTTONS: [
    { label: 'Bold', style: 'BOLD', className: 'custom-css-class1' },
    { label: 'Bold', style: 'BOLD', className: 'custom-css-class2' }
  ]
};

class StatefulEditor extends React.Component {

  state = {
    value: RichTextEditor.createEmptyValue()
  }

  letterNumber(value) {

    value = value.toString('html')
      .replace(/<.?\/?\b[^>]*>/gi, '') // strip html
      .replace(/\n/gi, '') // do not count new line
      .replace(/&nbsp;/gi, ' '); // space like one char

    if (this.props.currentNumberOfChar) {
      this.props.currentNumberOfChar(value.length)
    }
  }

  onChange = (value) => {
    this.setState({ value });
    debounce(this.letterNumber.bind(this, value), 1000, false)() //actually trottling, because dynamic args
  }

  render() {
    return (
      <RichTextEditor
        {...this.props}
        value={this.state.value}
        onChange={this.onChange.bind(this)}
        toolbarConfig={toolbarConfig}
      />
    );
  }
}


export default StatefulEditor;