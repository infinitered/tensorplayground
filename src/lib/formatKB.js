const numberWithCommas = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

export default numBytes => numberWithCommas(Math.round(numBytes / 1024))
