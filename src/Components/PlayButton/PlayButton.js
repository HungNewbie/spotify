import React from 'react';
import './PlayButton.css';
import Audio from '../Audio/sampleAudio';

class PlayButton extends React.Component {

    render() {
        return(                      
            <div>
                <Audio activeElement={this.props.activeElement} preview={this.props.preview}
                    toggleIndex={this.props.toggleIndex} index={this.props.index}
                    id={this.props.index} />          
            </div>
        )
    }
}

export default PlayButton;