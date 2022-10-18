import {useSelector} from "react-redux";
import {Navigate} from "react-router-dom";
import {department, isAuthenticated, isManager} from "../features/auth/authSlice"


export const RequireAuth = ({children}) => {
    let IsAuthenticated = useSelector(isAuthenticated);
    let Department = useSelector(department);
    if (!IsAuthenticated && !Department) {
        return <Navigate to="/login" replace/>;
    } else if (IsAuthenticated && Department) {
        return children;
    } else if (Department) {
        return <Navigate to="/no-permit" replace/>;
    }
};

export const RequireUnAuth = ({children}) => {
    let IsAuthenticated = useSelector(isAuthenticated);
    if (IsAuthenticated) {
        return <Navigate to="/dashboard" replace/>;
    }
    return children;
};

export const RequireManager = ({children}) => {
    let IsManager = useSelector(isManager);
    if (!IsManager) {
        return <Navigate to="/dashboard" replace/>;
    }
    return children;
};

export const RequireAuthC = ({children}) => {
    let IsAuthenticated = useSelector(isAuthenticated);
    if (!IsAuthenticated) {
        return (
            <></>
        );
    }
    return children;
};

export const RequireUnAuthC = ({children}) => {
    let IsAuthenticated = useSelector(isAuthenticated);
    if (IsAuthenticated) {
        return (
            <></>
        );
    }
    return children;
};

export const RequireManagerC = ({children}) => {
    let IsManager = useSelector(isManager);
    if (!IsManager) {
        return (
            <></>
        );
    }
    return children;
};
