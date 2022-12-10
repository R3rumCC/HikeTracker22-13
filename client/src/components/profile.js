import { Person, Envelope, Telephone, PersonWorkspace } from "react-bootstrap-icons";
import { Button } from "react-bootstrap";

const Profile = ({ user, logout, returnToHome }) => {
  return (
    <div className="d-flex flex-column">
      <div className="d-flex flex-row" style={{paddingTop:20}}>
        <Person size={30} style={{marginTop:5}}/>
        <div className="p-2 text-left" style={{fontSize:20}}>{user.name}</div>
        <div className="p-2 text-left" style={{fontSize:20}}>{user.lastname}</div>
      </div>
      <div className="d-flex flex-row" style={{paddingBottom:20}}>
        <Envelope size={30} style={{marginTop:5}}/>
        <div className="p-2 text-left" style={{fontSize:20}}>{user.username}</div>
      </div>
      <div className="d-flex flex-row" style={{paddingBottom:20}}>
        <Telephone size={30} style={{marginTop:5}}/>
        <div className="p-2 text-left" style={{fontSize:20}}>{user.phone_number}</div>
      </div>
      <div className="d-flex flex-row" style={{paddingBottom:20}}>
        <PersonWorkspace size={30} style={{marginTop:5}}/>
        <div className="p-2 text-left" style={{fontSize:20}}>{user.role}</div>
      </div>
      <div className="d-flex flex-row">
        <Button style={{marginRight: 5, width:"8%"}} onClick={returnToHome}>Home</Button>
      </div>
    </div>
  );
};

export default Profile;