import moment from 'moment';

function momentsFrom(starts, dur) {
    let startDate = moment(starts);
    let duration = moment.duration(dur, 'minutes');

    let from = moment(starts);
    let to = moment(from).add(duration);

    return {
      startDate,
      from,
      to,
      duration
    };
}

export default momentsFrom;