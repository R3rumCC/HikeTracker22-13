import { React, useState } from 'react';
import { Row, Col, Nav } from 'react-bootstrap';
import Profile from './profile';
import { SearchHut } from './SearchHut';
import { PerformancePage } from './PerformancePage';

function Hiker_Home(props){
    const [searchHutForm, setSearchHutForm] = useState(false);
    const [performanceForm, setPerformanceForm] = useState(false);
    const [profile, setProfile] = useState(true);


    const selectProfile = () => {
		setSearchHutForm(false); setPerformanceForm(false); setProfile(true);
	};

    const selectHut = () => {
		setSearchHutForm(true); setPerformanceForm(false); setProfile(false);
	};

    const selectPerformance = () => {
		setSearchHutForm(false); setPerformanceForm(true); setProfile(false);
	};

    return (
		<Row>
			<Col xs={2}>
				<Hiker_Home_Sidebar setHutForm={selectHut} setPerForm={selectPerformance} setProfile={selectProfile} />
			</Col>
			<Col xs={10}>
				<div>{profile ? <Profile user={props.currentUser} /> : <></>}</div>
                <div>{searchHutForm ? <SearchHut/> : <></>}</div>
                <div>{performanceForm ? <PerformancePage/> : <></>}</div>
			</Col>
		</Row>
	)
}


function Hiker_Home_Sidebar(props) {
	return (
		<Nav className="col-md-12 d-none d-md-block sidebar">
			<div className="sidebar-sticky"></div>
			<Nav.Item>
				<Nav.Link onClick={() => props.setProfile()}>Profile</Nav.Link>
			</Nav.Item>
			<Nav.Item>
				<Nav.Link onClick={() => props.setHutForm()}>Search for a hut</Nav.Link>
			</Nav.Item>
			<Nav.Item>
				<Nav.Link onClick={() => props.setPerForm()}>Insert your performances</Nav.Link>
			</Nav.Item>
		</Nav>
	)
}

export { Hiker_Home };