import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import moment from 'moment';

const events = [
  { day: 1, time: '17:00:00', label: 'Monday at 5:00 PM' }, //declaration of the events 
  { day: 4, time: '14:37:00', label: 'Thursday at 2:37 PM' },
  { day: 6, time: '14:54:00', label: 'Saturday at 2:54 PM' },
];

function App() {
  const calculateTimeLeft = () => {
    const currentDate = moment(); // Declaration of current date
    const currentDay = currentDate.day();
    const currentTime = currentDate.valueOf();
    let nextEventDate;
    let nextEventLabel;

    // Find the next closest event
    for (let i = 0; i < events.length; i++) { 
      const event = events[i];
      const eventDay = event.day;
      const eventTime = moment(event.time, 'HH:mm:ss').isoWeekday(eventDay).valueOf();

      if (eventDay > currentDay || (eventDay === currentDay && eventTime > currentTime)) { // searching for the event
        nextEventDate = moment(event.time, 'HH:mm:ss').isoWeekday(eventDay);
        nextEventLabel = event.label;
        break;
      }
    }

    if (!nextEventDate) {
      // If there are no upcoming events this week set the next event to the first event next week
      const firstEvent = events[0];
      nextEventDate = moment(firstEvent.time, 'HH:mm:ss').isoWeekday(firstEvent.day + 7);
      nextEventLabel = firstEvent.label;
    } // this approach makes the code sustainable and usable for different events 

    const difference = nextEventDate.diff(currentDate, 'milliseconds'); // Self explanatory lol
    let timeLeft = {};

    if (difference > 0) { // worked with this approach even tho i couldve used the moment library as im not as familiar with it
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return { timeLeft, nextEventLabel }; // We need the timeleft to display it as long as the label of the event
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [nextEventLabel, setNextEventLabel] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const { timeLeft, nextEventLabel } = calculateTimeLeft();
      setTimeLeft(timeLeft);
      setNextEventLabel(nextEventLabel);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}> 
      {timeLeft.days || timeLeft.hours || timeLeft.minutes || timeLeft.seconds ? (
        <View style={styles.clockContainer}>
          <Text style={styles.timeText}>{String(timeLeft.days).padStart(2, '0')}</Text>
          <Text style={styles.timeColon}>:</Text>
          <Text style={styles.timeText}>{String(timeLeft.hours).padStart(2, '0')}</Text>
          <Text style={styles.timeColon}>:</Text>
          <Text style={styles.timeText}>{String(timeLeft.minutes).padStart(2, '0')}</Text>
          <Text style={styles.timeColon}>:</Text>
          <Text style={styles.timeText}>{String(timeLeft.seconds).padStart(2, '0')}</Text>
        </View>
      ) : null}
      <Text style={styles.nextEventText}>Next Event: {nextEventLabel}</Text>
      <Text style={styles.madeByText}>Made by Youssef RAIES</Text>
    </View>
  );
}
// i added css for visibility (thanks chatgpt)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  clockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
  },
  timeColon: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 5,
  },
  nextEventText: {
    marginTop: 10,
    color: 'green',
    fontSize: 18,
  },
  madeByText: {
    position: 'absolute',
    bottom: 20,
    fontSize: 16,
    color: 'gray',
  },
});

export default App;
