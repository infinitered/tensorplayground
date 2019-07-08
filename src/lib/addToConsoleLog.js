let log = console.log

export default thingToAdd => {
  console.log = function() {
    log(arguments)
    thingToAdd(arguments)
    log.apply(log, arguments)
  }
}
