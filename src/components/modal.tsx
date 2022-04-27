import Box from "@mui/material/Box";
import MuiModal from "@mui/material/Modal";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from '@mui/icons-material/Close';
import ThreadForm from "./threadForm";

const useStyles = makeStyles((theme) => ({
    box: {
        [theme.breakpoints.down(600)]: {
            maxWidth: "none!important",
            maxHeight: '95vh!important',
            width: '75vw!important',
        },
    },
    closeButton: {
        position: 'absolute',
        top: 1,
        right: 1,
        fontSize: '1.1rem!important',
        cursor: 'pointer'
    }
}));

interface propTypes {
    modalOpen: boolean,
    setModalOpen: Function,
    websocket: WebSocket,
    setThreadOpen: Function,
    setThreadId: Function,
}

const Modal = ({ modalOpen, setModalOpen, websocket, setThreadOpen, setThreadId }: propTypes) => {
    const classes = useStyles();

    const handleClose = () => {
        setModalOpen(false);
    };

    return (
        <MuiModal
            open={modalOpen}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    maxWidth: "40vw",
                    bgcolor: "background.paper",
                    border: "2px solid #000",
                    boxShadow: 24,
                    p: 4,
                }}
                className={classes.box}
            >
                <CloseIcon className={classes.closeButton} onClick={handleClose} />
                <ThreadForm websocket={websocket} setModalOpen={setModalOpen} setThreadOpen={setThreadOpen} setThreadId={setThreadId} />
            </Box>
        </MuiModal>
    );
}

export default Modal;