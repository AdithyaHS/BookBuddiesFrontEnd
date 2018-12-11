import React, {Component} from 'react'
import Card from "@material-ui/core/Card";
import './Explore.css'
import {Link} from 'react-router-dom';
import AppBar from '../../components/AppBar/AppBar'
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

class Explore extends Component {

    componentWillMount(){
        console.log("Explore component will mount --------------------------")
    }

    render () {
        return (
            <div>
                <section>
                <AppBar position="fixed" >
                </AppBar>
            </section>
            </div>
            

            
        );
    }
}

export default Explore;