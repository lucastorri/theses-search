var s = "W3Schools is <span class=\"highlight0\">optimized</span> for learning, testing, and training. Examples might be simplified to improve reading and basic understanding.Tutorials, references, and examples are constantly reviewed to <span class=\"highlight0\">avoid</span> errors, but we cannot warrant full correctness of all content.While using this site, you agree to have read and accepted our terms of use and privacy policy.Copyright 1999-2012 by Refsnes Data. <span class=\"highlight0\">All</span> Rights Reserved.";


var limitTo = function() {

    var r = /(<span class="highlight\d">(.*?)<\/span>)/;
    
    function Match(str, orig) { return { str: str, orig: orig || str }; }
    
    var dots = '<span class="dots">...</span>';
    
    function Stepper(index, words, left) {
        var ri = index;
        var li = index;
        var rs = null;
        var ls = left;
    
        var myWords = [words[index]];
    
        var moveLeft = index != 0;
    
        var self = {
            rightStepper: function(_rs) {
                if (!_rs) { return rs; }
                rs = _rs;
            },
            leftStepper: function(_ls) {
                if (!_ls) { return ls; }
                ls = _ls;
            },
            rightIndex: function() {
                return ri;
            },
            leftIndex: function() {
                return li;
            },
            sum: function() {
                var t = myWords.length - 1;
                for (var i = 0; i < myWords.length; i++) {
                    t += myWords[i].str.length;
                }
                return t;
            },
            hasNext: function() {
                var has = ri < words.length && li > 0;
            
                if (has && ls) {
                    has = ls.rightIndex() < (li - 1);
                }
                if (has && rs) {
                    has = rs.leftIndex() > (ri + 1);
                }
            
                return has;
            },
            next: function() {
                if (moveLeft) {
                
                    var canNext = true;
                    if (ls) {
                        canNext = ls.rightIndex() < (li - 1);
                    }
                    canNext = canNext && li > 0;
                
                    if (canNext && words[--li]) {
                        myWords.unshift(words[li]);
                    }
                
                } else {
                
                    var canNext = true;
                    if (rs) {
                        canNext = rs.leftIndex() > (ri + 1);
                    }
                    canNext = canNext && ri < words.length;
                
                    if (canNext && words[++ri]) {
                        myWords.push(words[ri]);
                    }
                
                }
                moveLeft = !moveLeft;
            },
            w: function() {
                return myWords;
            },
            join: function(fin) {
                fin = fin || [];
                if (li > 0) {
                    if (ls) {
                        if ((ls.rightIndex()) != (li - 1)) {
                            fin.push(dots);
                        }
                    } else {
                        fin.push(dots);
                    }
                }
                for (var i=0; i < myWords.length; i++) {
                    fin.push(myWords[i].orig);
                };
                if (rs) {
                    rs.join(fin);
                } else if (ri < words.length) {
                    fin.push(dots);
                }
                return fin;
            }
        };
    
        if (ls) {
            ls.rightStepper(self);
        }
    
        return self;
    }

    function StepperGroup(ss) {
    
    
    
        var hasNext = function() {
            for (var i=0; i < ss.length; i++) {
                if (ss[i].hasNext()) { return true; }
            };
            return false;
        };
    
        var total = function() {
            var t = 0;
            for (var i=0; i < ss.length; i++) {
                t += ss[i].sum();
            };
            return t;
        };
    
        var toString = function() {
            return ss[0].join().join(' ');
        };
    
        return {
            run: function(limit) {
                for (var i = 0; total() < limit && hasNext(); i = (i+1) % ss.length) {
                    ss[i].next();
                }
                return toString();
            }
        };
    }
   
    return function(s, limit) {
        var parts = s.split(r);
        
        var allWords = [];
        var matchesIndex = [];
        for (var i = 0; i < parts.length; i++) {
            if (parts[i].match(r)) {
                matchesIndex.push(allWords.length);
                var matched = parts[i];
                allWords.push(Match(parts[++i], matched));
            } else {
                var words = parts[i].split(/\s+/);
                for (var j = 0; j < words.length; j++) {
                    words[j] && allWords.push(Match(words[j]));
                }
            }
        }

        var steppers = function() {
            var ss = [];
            var last = null;
            for (var i = 0; i < matchesIndex.length; i++) {
                last = Stepper(matchesIndex[i], allWords, last);
                ss.push(last)
            }
            return StepperGroup(ss);
        }();
        return steppers.run(100)
    };
}();










console.log(limitTo(s, 100));