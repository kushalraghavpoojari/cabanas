import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Cabanas extends Component {

    render() {
        return (
            <div className="container-fluid main">
                <div className="content">
                    <div className="row">
                        <h4 className="text-center">Choose you selection</h4>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <Link to="/map">
                                <div className="box">
                                    <h4>
                                        Cabanas Map
                                        <span className="move-right">
                                            <i className="fa fa-map" aria-hidden="true"></i>
                                        </span>
                                    </h4>
                                </div>
                            </Link>
                        </div>
                        <div className="col-md-6">
                            <Link to="/resources">
                                <div className="box">
                                    <h4>
                                        Cabanas Resources
                                        <span className="move-right">
                                            <i className="fa fa-map-marker" aria-hidden="true"></i>
                                        </span>
                                    </h4>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default Cabanas;