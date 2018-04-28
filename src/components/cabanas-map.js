import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './cabana-styles.css';
import Draggable from 'react-draggable';

class CabanasMap extends Component {

    state = {
        img: undefined,
        x: 0,
        y: 0,
        scaleFactor: 1,
        widthOffset: 0,
        X: 0,
        Y: 0,
        radius: 0,
        drag: {
            opacity: 0
        }
    }


    onImageUpload = () => {
        const fileInput = document.getElementById("myFile");
        const file = fileInput.files[0];
        const reader = new FileReader();
        let self = this;
        
        reader.onload = function(e) {
            // Create a new image.
            let img = new Image();
            img.src = reader.result;
            self.setState({img})
        }
        reader.readAsDataURL(file);
    }

    getCanvas = () => {
        //TODO: modify & move this function to utils
        let canvas = document.getElementById("cabanas-location");
        let context = canvas.getContext('2d');
        const maxHeight = 325;
        const maxWidth = 900;
        const parentViewWidth = 950;
        const imageWidth = this.state.img.width;
        const imageHeight = this.state.img.height;
        const heightRatio = parseFloat(maxHeight, 10) / parseFloat(imageHeight, 10);
        const widthRatio = maxWidth / imageWidth;
        this.setState({scaleFactor : Math.min(heightRatio, widthRatio, 1)})
        this.setState({widthOffset : (parentViewWidth - (Math.min(heightRatio, widthRatio, 1) * imageWidth))/2});
        const scaledHeight = imageHeight * Math.min(heightRatio, widthRatio, 1);
        const scaledWidth = imageWidth * Math.min(heightRatio, widthRatio, 1);
        
        canvas.width = scaledWidth;
        canvas.height = scaledHeight;
        context.drawImage(this.state.img, 0, 0, scaledWidth, scaledHeight);
    }

    placeCircle = (evt) => {
        //TODO: modify & move this function to utils
        this.setState({drag : {opacity: 1}});
        const canvas = document.getElementById("cabana-view");
        const rect = canvas.getBoundingClientRect();
        let x = evt.clientX - rect.left;
        let y = evt.clientY - rect.top;
        this.setState({x, y});

        const scaleFactor = this.state.scaleFactor;
        const widthOffset = this.state.widthOffset;
        const diameterElement = document.getElementById('diameter').value;
        let diameter = diameterElement * scaleFactor;
        let radius = diameter/2 ;
        this.setState({radius});
        let X,
            Y;
        X = Math.round((x + radius - widthOffset) / scaleFactor);
        Y = Math.round((y + radius)/ scaleFactor);
        this.setState({X, Y});
        document.getElementById('x').innerHTML = `X: ${X}`;;
        document.getElementById('y').innerHTML = `Y: ${Y}`;
        this.changeCSS(radius, X, Y);
    }

    changeCSS = (radius, X, Y)=> {
        //TODO: modify & move this function to utils
        const scaleFactor = this.state.scaleFactor;
        const widthOffset = this.state.widthOffset;
        let circleElement = document.getElementById('cabanas-circle');
        let x = (X * scaleFactor) + widthOffset - radius;
        let y = (Y * scaleFactor) - radius;
        circleElement.style.width = radius*2 + 'px';
        circleElement.style.height = radius*2 + 'px';
        circleElement.style.top = y + 'px';
        circleElement.style.left = x + 'px';
    }

    getPos = () => {
        //TODO: modify & move this function to utils
        const  {x,y} = this.state;
        const circle = document.getElementById('cabanas-circle');
        let transformStr = circle.style.transform;
        let transformLength = transformStr.length;
        let subString = transformStr.substring(10,transformLength-1).split(',');
        const newX = parseFloat(subString[0].substring(0,subString[0].length-2), 10) + x;
        const newY = parseFloat(subString[1].substring(1,subString[1].length-2)) + y;


        const scaleFactor = this.state.scaleFactor;
        const widthOffset = this.state.widthOffset;
        const diameterElement = document.getElementById('diameter').value;
        let diameter = diameterElement * scaleFactor;
        let radius = diameter/2 ;
        this.setState({radius});
        let X,
            Y;
        X = Math.round((newX + radius - widthOffset) / scaleFactor);
        Y = Math.round((newY + radius)/ scaleFactor);
        this.setState({X, Y});
        document.getElementById('x').innerHTML = `X: ${X}`;
        document.getElementById('y').innerHTML = `Y: ${Y}`;
    }

    
    render() {
        return (
            <div className="container-fluid cabanas-map-content">
                <div className="row navigate">
                    <Link to="/">
                        <span className="btn btn-modified">
                            Home &nbsp;
                            <i className="fa fa-home " aria-hidden="true"></i>
                        </span>
                    </Link>
                    <Link to="/resources">
                        <span className="move-right btn btn-modified">
                            Cabana - Resources &nbsp;
                            <i className="fa fa-map-marker" aria-hidden="true"></i>
                        </span>
                    </Link>
                </div>
                <div className="map-content">
                    <div className="row">
                        <div className="col-md-4">
                            <div className="upload-section">
                                <span className="btn btn-modified">Upload &nbsp;<i className="fa fa-upload" aria-hidden="true"></i></span>
                                <input type="file" id="myFile" className="upload-input" onChange={this.onImageUpload}/>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <input className="form-control" id="diameter" placeholder="Diameter"/>
                        </div>
                        <span className="col-md-2 btn btn-modified" onClick={this.getCanvas}>Get Map</span>
                        <span className="col-md-offset-1 col-md-2 btn btn-modified" onClick={this.getPos}>Get XY</span>
                    </div>
                    
                    <div className="cabanaView" id="cabana-view">
                        <canvas className="cabana-map" id="cabanas-location"
                            onClick={this.placeCircle}>
                        </canvas>
                        <Draggable
                            handle=".circleElement"
                            defaultPosition={{x: 0, y: 0}}
                            position={null}
                        >
                            <div className='circleElement' id='cabanas-circle' style={this.state.drag}></div>
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

export default CabanasMap;