import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import {
  Auth,
  CreateFeedback,
  Dashboard,
  Employee,
  Feedbacks,
  Home,
  PageNotFound,
  Setting,
  Templates,
} from "./containers";
import { useEffect, useState } from "react";
import { auth, db } from "./config/firebase.config";
import { Spinner, VerifyPopup } from "./components";
import { useDispatch } from "react-redux";
import { SET_USER } from "./context/actions/userActions";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { SET_ROLE } from "./context/actions/roleActions";
import { createDefaultRole, getRoleWithRoleID } from "./api";
import { ToastContainer } from "react-toastify";
import CreateAccount from "./containers/CreateAccount";
import "react-toastify/dist/ReactToastify.css";
import "rsuite/dist/rsuite.min.css";

function App() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [userRole, setUserRole] = useState("");
  const dispatch = useDispatch();

  const getUserDataAndRole = (userCred) => {
    getDoc(doc(db, "user", userCred.uid)).then((userDoc) => {
      if (userDoc.exists() && userDoc.data().roleId) {
        const userData = {
          ...userCred.providerData[0],
          displayName: userCred.displayName,
          emailVerified: userCred.emailVerified,
          creationTime: userCred.metadata.creationTime,
          lastSignInTime: userCred.metadata.lastSignInTime,
          photoURL: userCred.photoURL,
          roleId: userDoc.data().roleId,
        };
        setDoc(doc(db, "user", userCred.uid), userData).then(() => {
          dispatch(SET_USER(userData));
          if (userCred.emailVerified) {
            setIsEmailVerified(true);
          } else {
            setIsEmailVerified(false);
          }
        });
        const getRole = async () => {
          const roleId = userDoc.data().roleId;
          const role = await getRoleWithRoleID(roleId);
          setUserRole(role);
          console.log("role_name: ", role);
          dispatch(SET_ROLE(role));
        };
        getRole();
        localStorage.setItem("userId", userCred.uid);
        localStorage.setItem("uid", userCred.providerData[0].uid);
        console.log("userCred: ", userCred);
        console.log("roleID: ", userDoc.data().roleId);
        console.log("uid: ", userCred.providerData[0].uid);
      } else {
        console.log("Invalid roleId => Update role");
        setDoc(doc(db, "user", userCred.uid), userCred.providerData[0]);
        createDefaultRole(userCred.uid).then(() => {
          // Sau khi cập nhật role, gọi lại hàm getUserDataAndRole để cập nhật dữ liệu mới
          getUserDataAndRole(userCred);
        });
      }
    });
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      (userCred) => {
        if (userCred) {
          setIsLogin(true);
          getUserDataAndRole(userCred);
        } else {
        }

        setInterval(() => {
          setIsLoading(false);
        }, 1000);
      },
      [dispatch, navigate]
    );

    return () => unsubscribe();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />
      {isLoading ? (
        <div className="w-screen h-screen flex items-center justify-center overflow-hidden">
          <Spinner />
        </div>
      ) : (
        <div className="bg-white">
          <Routes>
            <Route path="/404" element={<PageNotFound />} />
            <Route path="/home/*" element={<Home />} />
            <Route path="/signup/*" element={<CreateAccount />} />

            {!isLogin && (
              <>
                <Route path="/auth" element={<Auth />} />
              </>
            )}

            {isLogin && !isEmailVerified && (
              <>
                <Route path="/verify" element={<VerifyPopup />} />
                <Route path="*" element={<Navigate to="/verify" />} />
              </>
            )}

            {isLogin && isEmailVerified && (
              <>
                <Route path="/feedback" element={<Feedbacks />} />
                <Route path="/templates" element={<Templates />} />
                <Route path="/setting/*" element={<Setting />} />
                <Route path="/create-feedback" element={<CreateFeedback />} />

                {userRole === "employee" && (
                  <Route path="/employee/*" element={<Employee />} />
                )}
                {userRole === "admin" && (
                  <Route path="/admin/*" element={<Dashboard />} />
                )}
              </>
            )}
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
        </div>
      )}
    </>
  );
}

export default App;
