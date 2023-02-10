import React from 'react'


class Audio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeElement: this.props.index
        }
    }    
    render() {
        return (
            <div>                
                <audio className="sample" controls id={this.props.id} volume="0.1">
                    <source src={this.props.preview}></source>
                </audio>
            </div>
    )
    }
}

export default Audio;