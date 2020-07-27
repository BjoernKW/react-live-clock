import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

export default function ReactLiveClock(props) {
  const {timezone, date, format, interval, ticking, onChange, blinking} = props;
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [formatToUse, setFormatToUse] = useState(format);
  let colonOn = true;


  function reverseString(str) {
    const splitString = str.split('');
    const reverseArray = splitString.reverse();
    const joinArray = reverseArray.join('');

    return joinArray;
  }

  useEffect(() => {
    if (ticking || blinking) {
      const tick = setInterval(() => {
        const now = Date.now();

        if (blinking) {
          if (colonOn) {
            let newFormat = reverseString(format);

            newFormat = newFormat.replace(':', ' ');
            newFormat = reverseString(newFormat);

            colonOn = false;
            setFormatToUse(newFormat);
          } else {
            setFormatToUse(format);
            colonOn = true;
          }
        }

        if (ticking) {
          setCurrentTime(now);
        }

        if (typeof onChange === 'function') {
          onChange(now);
        }
      }, interval);

      return () => clearInterval(tick);
    }

    return () => true;
  }, [...props]);


  return (
    <Moment
      date={date}
      format={formatToUse}
      tz={timezone}
    >
      {currentTime}
    </Moment>
  );
}

ReactLiveClock.propTypes = {
  date: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
  blinking: PropTypes.bool,
  format: PropTypes.string,
  interval: PropTypes.number,
  ticking: PropTypes.bool,
  timezone: PropTypes.string,
  onChange: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.func
  ])
};

ReactLiveClock.defaultProps = {
  date: null,
  blinking: false,
  format: 'HH:mm',
  interval: 1000,
  ticking: false,
  timezone: null,
  onChange: false
};
