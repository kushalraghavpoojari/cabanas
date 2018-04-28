import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Draggable from 'react-draggable';

class CabanasResources extends Component {

    state = {
        img: undefined,
        x: 0,
        y: 0,
        scaleFactor: 1,
        widthOffset: 0,
        X: 0,
        Y: 0,
        drag: {
            opacity: 0
        }
    }

    onImageUpload = () => {
        let fileInput = document.getElementById("myFile2");
        let file = fileInput.files[0];
        let reader = new FileReader();
        let self = this;
        
        reader.onload = function(e) {
            // Create a new image.
            let img = new Image();
            img.src = reader.result;
            self.setState({img});
        }
        reader.readAsDataURL(file);
    }

    getCanvas = () => {
        //TODO: modify & move this function to utils
        var self = this;
        let canvas = document.getElementById("cabanas-location");
        let context = canvas.getContext('2d');
        const maxHeight = 325;
        const maxWidth = 900;
        const parentViewWidth = 950;
        const imageWidth = self.state.img.width;
        const imageHeight = self.state.img.height;
        const heightRatio = parseFloat(maxHeight, 10) / parseFloat(imageHeight, 10);
        const widthRatio = maxWidth / imageWidth;
        self.setState({scaleFactor : Math.min(heightRatio, widthRatio, 1)})
        self.setState({widthOffset : (parentViewWidth - (Math.min(heightRatio, widthRatio, 1) * imageWidth))/2});
        const scaledHeight = imageHeight * Math.min(heightRatio, widthRatio, 1);
        const scaledWidth = imageWidth * Math.min(heightRatio, widthRatio, 1);
        
        canvas.width = scaledWidth;
        canvas.height = scaledHeight;
        context.drawImage(this.state.img, 0, 0, scaledWidth, scaledHeight);
    }

    placeMarker = (evt) => {
        //TODO: modify & move this function to utils
        this.setState({drag : {opacity: 1}});
        const canvas = document.getElementById("cabana-view");
        const rect = canvas.getBoundingClientRect();
        let x = evt.clientX - rect.left;
        let y = evt.clientY - rect.top;
        this.setState({x, y});

        const scaleFactor = this.state.scaleFactor;
        const widthOffset = this.state.widthOffset;
        const widthElement = document.getElementById('width').value;
        const heightElement = document.getElementById('height').value;
        let X,
            Y;
        X = Math.round((x  - widthOffset) / scaleFactor);
        Y = Math.round(y/ scaleFactor);
        this.setState({X, Y});
        document.getElementById('x').innerHTML = `X: ${X}`;;
        document.getElementById('y').innerHTML = `Y: ${Y}`;
        this.changeCSS(widthElement, heightElement, X, Y);
    }

    changeCSS = (width, height, X, Y)=> {
        //TODO: move this function to utils
        const scaleFactor = this.state.scaleFactor;
        const widthOffset = this.state.widthOffset;
        let circleElement = document.getElementById('cabanas-marker');
        let x = (X * scaleFactor) + widthOffset;
        let y = (Y * scaleFactor);
        circleElement.style.width = width + 'px';
        circleElement.style.height = height + 'px';
        circleElement.style.top = y + 'px';
        circleElement.style.left = x + 'px';
    }

    getPos = () => {
        //TODO: modify & move this function to utils
        const  {x,y} = this.state;
        const circle = document.getElementById('cabanas-marker');
        let transformStr = circle.style.transform;
        let transformLength = transformStr.length;
        let subString = transformStr.substring(10,transformLength-1).split(',');
        const newX = parseFloat(subString[0].substring(0,subString[0].length-2), 10) + x;
        const newY = parseFloat(subString[1].substring(1,subString[1].length-2)) + y;

        const scaleFactor = this.state.scaleFactor;
        const widthOffset = this.state.widthOffset;
        let X,
            Y;
        X = Math.round((newX - widthOffset) / scaleFactor);
        Y = Math.round((newY)/ scaleFactor);
        this.setState({X, Y});
        document.getElementById('x').innerHTML = `X: ${X}`;
        document.getElementById('y').innerHTML = `Y: ${Y}`;
    }


    render() {
        return (
            <div className="container-fluid cabanas-resource-content">
                <div className="row navigate">
                    <Link to="/">
                        <span className="btn btn-modified">
                            Home &nbsp;
                            <i className="fa fa-home " aria-hidden="true"></i>
                        </span>
                    </Link>
                    <Link to="/map">
                        <span className="move-right btn btn-modified">
                            Cabanas - Map &nbsp;
                            <i className="fa fa-map" aria-hidden="true"></i>
                        </span>
                    </Link>
                </div>

                <div className="resource-content">
                    <div className="row">
                        <div className="col-md-4">
                            <div className="upload-section">
                                <span className="btn btn-modified">Upload &nbsp;<i className="fa fa-upload" aria-hidden="true"></i></span>
                                <input type="file" id="myFile2" className="upload-input" onChange={this.onImageUpload}/>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <input className="form-control" id="width" placeholder="width"/>
                            <input className="form-control" id="height" placeholder="height"/>
                        </div>
                        <span className="col-md-2 btn btn-modified" onClick={this.getCanvas}>Get Map</span>
                        <span className="col-md-offset-1 col-md-2 btn btn-modified" onClick={this.getPos}>Get XY</span>
                    </div>

                    <div className="cabanaView" id="cabana-view">
                        <canvas className="cabana-map" id="cabanas-location"
                            onClick={this.placeMarker}>
                        </canvas>
                        <Draggable
                            handle=".markerElement"
                            defaultPosition={{x: 0, y: 0}}
                            position={null}
                        >
                            <div className='markerElement' id='cabanas-marker' style={this.state.drag}></div>
                        </Draggable>
                    </div>
                    <div className="row results">
                        <span id="x">X: null</span>
                        <span id="y" className="move-right">Y: null</span>
                    </div>
                </div>
            </div>
        );
    }

}

export default CabanasResources;