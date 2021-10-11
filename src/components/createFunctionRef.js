export default function createFunctionRef() {
  const ref = function(call) {
    ref.call = call;
  };
  ref.call = null;
  ref.callIfSet = function() {
    if (!ref.call) {
      return;
    }
    return ref.call.apply(this, arguments);
  };
  
  return ref;
}
