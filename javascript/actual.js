/*
Backend: key/value store

    GET /read?keys=foo,bar
    
    {
        "foo": 12,
        "bar": 100
    }
    
Frontend:

httpGetJson('/read?keys=foo', response => {
    console.log('The value of foo is ' + String(response['foo']));
});

// - Fetches the value for 'key' and calls 'cb(value)'
// - If getKey is called multiple times in a short time window (100ms),
//   then all those keys are fetched in a single HTTP request.
getKey(key, cb)

// Example:
getKey('foo', cb1)
getKey('bar', cb2)
getKey('foo', cb3)
// This should result in a single HTTP request (and not three)


// Should call cb1(value) within a reasonable amount of time
getKey('foo', cb1)
// Long drought of calls (say 2 minutes)
*/
let calledLast = null;
let calledNow = null;
let keys = [];
let callbacks = [];

    
// 1. getKey is called 2x within 100ms
// 2. after 100ms call httpGetJson w/ agg queryString
// 3. store cb's in array and loop thru them and execute cb(response[i])

function getKey(key, cb) {
    calledNow = Date.now();
 
    if (!calledLast || (calledNow - calledLast < 100)) {
        if (!
        keys.push(key);
        callbacks.push(cb);
    } else {
        calledLast = Date.now();
        let keyString = '';
    
        for (let i = 0; i < keys.length; i++) {
            let keyInstance = '';
            if (i > 0) {
                keyInstance += ',';
            }
            keyInstance += keys[i];
            keyString += keyInstance;
        }
        
        httpGetJson(`/read?keys=${keyString}`, (result) => {
            keys.forEach((key, i) => {
                const value = result[key];
                callbacks[i](value);
            });
        })
    }
}
