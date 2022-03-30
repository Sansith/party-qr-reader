import { useEffect, useState } from "react";
import "./App.css";
import { QrReader } from "react-qr-reader";
import { onValue, ref, runTransaction } from "firebase/database";
import { db, fs } from "./main";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import {
  Chip,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Box } from "@mui/system";
import InfoCard from "./InfoCard";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { version } from "../package.json";
interface Participant {
  name: string;
  email: string;
  food: string;
  drinks: string;
  id: string;
  empId: string;
}

enum DataOrder {
  EMAIL = 0,
  NAME = 1,
  FOOD = 2,
  ID = 3,
  DRINK = 4,
}

function App() {
  const [count, setCount] = useState(0);
  const [qrText, setQRText] = useState<string | undefined>();
  const [scannedPerson, setScannedPerson] = useState<Participant | undefined>();

  const [showScanner, setShowScanner] = useState(false);
  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    const countRef = ref(db, "checkInCount");
    console.log("init", { countRef });

    const unsub = onValue(
      countRef,
      (snap) => {
        const data = snap.val();
        console.log("COunt update", { data });
        setCount(data);
      },
      (error) => {
        console.log({ error });
      }
    );

    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    if (!qrText) return;

    console.log("on data change:::", qrText);
    setisLoading(true);
    const obj = parseQRText(qrText);
    handleOnCheckIn(obj)
      .then((res) => {
        setisLoading(false);
      })
      .catch((e) => {
        console.log("error:", { e });
        setisLoading(false);
      });
  }, [qrText]);

  const parseQRText = (text: string): Participant => {
    const resArr = text.split(";");

    return {
      empId: resArr[3],
      drinks: resArr[5],
      food: resArr[4],
      email: resArr[2],
      name: resArr[1],
      id: resArr[0],
    };
  };

  const handleOnCheckIn = async (participant: Participant) => {
    console.log("participant", { participant });

    const docRef = doc(fs, "participants", participant.empId);
    const docSnap = await getDoc(docRef);

    const realtimeParticipantsRef = ref(db, "checkInCount");

    if (docSnap.exists()) {
      alert("Already Checked In!");
      setQRText(undefined);
    } else {
      const res = await setDoc(docRef, {
        ...participant,
        checkInTime: new Date(),
      });

      const countRes = await runTransaction(realtimeParticipantsRef, (data) => {
        console.log("data", { data });
        if (data !== undefined) {
          data++;
        }
        return data;
      });
      setScannedPerson(participant);
      setQRText(undefined);
    }
  };

  return (
    <div>
      {isLoading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            backgroundColor: "rgba(255, 255, 255, 0.61)",
            height: "100%",
            width: "100%",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </div>
      )}
      <Box
        sx={{
          mx: "auto",
          m: 2,
          textAlign: "center",
        }}
      >
        <Stack direction="column" style={{ textAlign: "center" }}>
          <div>Total Check In:</div>
          <Typography variant="h3">{count}</Typography>
          <div>
            <IconButton
              onClick={() => setShowScanner((prev) => !prev)}
              color="primary"
              aria-label="upload picture"
              component="span"
            >
              {showScanner ? <CloseIcon /> : <CameraAltIcon />}
            </IconButton>
          </div>
        </Stack>
        {showScanner && (
          <QrReader
            scanDelay={1000}
            constraints={{ facingMode: "environment", latency: 2000 }}
            onResult={(result, error) => {
              if (!!result) {
                setQRText(result.getText());
              }
            }}
          />
        )}
        {scannedPerson && <InfoCard {...scannedPerson} isOk={true} />}
      </Box>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          textAlign: "center",
          zIndex: 12,
          width: "100%",
          padding: "5px",
          borderTopLeftRadius: "5px",
          borderTopRightRadius: "5px",
        }}
      >
        <div>Made with ❤️ by Seniya and Sandaru</div>
        <div>{version}v</div>
      </div>
    </div>
  );
}

export default App;
