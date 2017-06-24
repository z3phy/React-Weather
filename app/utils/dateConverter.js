function dateConverter(epoch) {
  let epochToDate = Date(epoch)
  let monthNum = 0
  let day = ''
  let months = {
    'Jan': '1',
    'Feb': '2',
    'Apr': '3',
    'Mar': '4',
    'May': '5',
    'Jun': '6',
    'Jul': '7',
    'Aug': '8',
    'Sep': '9',
    'Oct': '10',
    'Nov': '11',
    'Dec': '12'
  }

  if (epochToDate.slice(8,9) == 0) {
    day = epochToDate.slice(9,10)
  } else {
    day = epochToDate.slice(8,10)
  }

  Object.keys(months).forEach(function(month) {
    if (epochToDate.slice(4, 7) == month) {
      monthNum = months[month]
    }
  })

  let date = day + '/' + monthNum + '/' + epochToDate.slice(11,15)

  return date;
}

module.exports = dateConverter;
