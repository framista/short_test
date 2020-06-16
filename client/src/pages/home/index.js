import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import api from '../../api';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import FormDialog from '../../components/test';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  h1: {
    fontSize: '24px',
    marginBottom: '1em',
    textAlign: 'center',
    margin: '10px',
  },
  h2: {
    fontSize: '20px',
    marginBottom: '1em',
    textAlign: 'center',
    margin: '10px',
    textTransform: 'uppercase',
  },
  testBtn: {
    fontSize: '20px',
  },
  list: {
    width: '100%',
    maxWidth: '150px',
  },
  table: {
    maxWidth: 650,
  },
  logout: {
    position: 'fixed',
    right: '20px',
    top: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    fontSize: '15px',
  },
}));

export default function Home(props) {
  const taskNumber = 1;
  const classes = useStyles();
  const [tasks, setTasks] = React.useState([]);
  const [user, setUser] = React.useState('');
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [questions, setQuestions] = React.useState([]);
  const [answers, setAnswers] = React.useState([]);
  const [saveQuestions, setSaveQuestions] = React.useState(false);
  const [testBtn, setTestBtn] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      const result = await api.getStudentById();
      const student = result.data;
      setTasks([...student.tasks]);
      setTestBtn(student.tasks[0]);
      setUser(`${student.firstname} ${student.lastname}`);
    };
    fetchData();
  }, []);

  const handleDialogClose = async (data) => {
    const arr = Object.values(data).map((e) => e);
    setAnswers(arr);
    setDialogOpen(false);
    setSaveQuestions(true);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const test = questions.map((q, index) => ({
          question: q,
          answer: answers[index],
        }));
        await api.updateStudentTests({ test, taskNumber });
        setTestBtn(true);
      } catch (err) {
        console.log(err);
      }
    };
    if (tasks[taskNumber - 1] === 0) {
      fetchData();
    }
  }, [saveQuestions]);

  const randomNumbers = (n, max) => {
    const arr = [];
    while (arr.length < n) {
      const r = Math.floor(Math.random() * max);
      if (arr.indexOf(r) === -1) arr.push(r);
    }
    return arr;
  };

  const fetchQuestionData = async () => {
    const result = await api.getAllTasksForTask(taskNumber);
    const data = result.data.map((el) => {
      return el.question;
    });
    const numbers = randomNumbers(2, data.length);
    const selectedQuestion = numbers.map((n) => data[n]);
    setQuestions(selectedQuestion);
  };

  const handleLogout = () => {
    localStorage.removeItem('key-jwt-pwr-19');
    props.history.push('/login');
  };

  return (
    <div className={classes.root}>
      <div className={classes.logout}>
        <Typography variant="body1">{user}</Typography>
        <Button className={classes.button} onClick={handleLogout}>
          Wyloguj
        </Button>
      </div>
      <Typography color="textSecondary" variant="h1" className={classes.h1}>
        Automatyzacja wytwarzania
      </Typography>
      <Typography color="textSecondary" variant="h2" className={classes.h2}>
        <Link
          href="https://drive.google.com/file/d/1YGF1Kf2xkGQccsFbIYwEja2B_fk0bR_5/view"
          target="_blank"
        >
          Instrukcja
        </Link>
      </Typography>
      <Typography color="textSecondary" variant="h2" className={classes.h2}>
        <Button
          disabled={testBtn}
          color="primary"
          className={classes.testBtn}
          onClick={() => {
            fetchQuestionData();
            setDialogOpen(true);
          }}
        >
          Kartkówka
        </Button>
      </Typography>
      {dialogOpen && (
        <FormDialog
          taskNumber={0}
          questions={questions}
          closeDialog={handleDialogClose}
          timeQuestion={60} //sec
        />
      )}
    </div>
  );
}
