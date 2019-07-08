let log = console.log

export default thingToAdd => {
  console.log = function() {
    thingToAdd(arguments)
    log.apply(log, arguments)
  }
}
