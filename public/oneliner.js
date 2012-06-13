var s = "W3Schools is <span class=\"highlight0\">optimized</span> for learning, testing, and training. Examples might be simplified to improve reading and basic understanding.Tutorials, references, and examples are constantly reviewed to <span class=\"highlight0\">avoid</span> errors, but we cannot warrant full correctness of all content.While using this site, you agree to have read and accepted our terms of use and privacy policy.Copyright 1999-2012 by Refsnes Data. <span class=\"highlight0\">All</span> Rights Reserved.";


var limitTo = function() {

    var highlight = /(<span class="highlight\d">(.*?)<\/span>[^\s]*)/;
    var space = /\s+/;
    var dots = '<span class="dots">[...]</span>';
    var join = ' ';
    
    function Match(str, orig) { return { str: str, orig: orig || str }; }
    
    function Stepper(index, words, left) {
        var ri = index;
        var li = index;
        var rs = null;
        var ls = left;
    
        var myWords = [words[index]];
    
        var moveLeft = index != 0;
    
        var hasLeft = function(maxNext) {
            var hasLeft;
            if (ls) {
                hasLeft = ls.rightIndex() < (li - 1);
            } else {
                hasLeft = li > 0;
            }
            hasLeft = hasLeft && (words[li - 1] && words[li - 1].str.length < maxNext);
            return hasLeft;
        };
        var hasRight = function(maxNext) {
            var hasRight;
            if (rs) {
                hasRight = rs.leftIndex() > (ri + 1);
            } else {
                hasRight = ri < words.length;
            }                
            hasRight = hasRight && (words[ri + 1] && words[ri + 1].str.length < maxNext);
            return hasRight;
        };
    
        var self = {
            rightStepper: function(_rs) {
                if (!_rs) { return rs; }
                rs = _rs;
            },
            leftStepper: function(_ls) {
                if (!_ls) { return ls; }
                ls = _ls;
            },
            rightIndex: function() { return ri; },
            leftIndex: function() { return li; },
            sum: function() {
                var t = myWords.length - 1;
                for (var i = 0; i < myWords.length; i++) {
                    t += myWords[i].str.length;
                }
                return t;
            },
            hasNext: function(maxNext) {
                return hasLeft(maxNext) || hasRight(maxNext);
            },
            next: function(maxNext) {
                if (moveLeft && hasLeft(maxNext)) {
                    myWords.unshift(words[--li]);
                } else if (hasRight(maxNext)){
                    myWords.push(words[++ri]);
                }
                moveLeft = !moveLeft;
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
                } else if (ri < words.length - 1) {
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
        var hasNext = function(maxNext) {
            for (var i=0; i < ss.length; i++) {
                if (ss[i].hasNext(maxNext)) { return true; }
            };
            return false;
        };
        var total = function() {
            var t = (ss.length - 1) * (2 + join.length);
            for (var i=0; i < ss.length; i++) {
                t += ss[i].sum();
            };
            return t;
        };
        var toString = function() {
            return ss[0].join().join(join);
        };
        return {
            run: function(limit) {
                var t = total();
                var left = limit - t;
                for (var i = 0; left > 0 && hasNext(left); i = (i+1) % ss.length) {
                    ss[i].next(left);
                    t = total();
                    left = limit - t
                }
                return toString();
            }
        };
    }
   
    return function(s, limit) {
        var parts = s.split(highlight);
        
        var allWords = [];
        var matchesIndex = [];
        for (var i = 0; i < parts.length; i++) {
            if (parts[i].match(highlight)) {
                matchesIndex.push(allWords.length);
                var matched = parts[i];
                allWords.push(Match(parts[++i], matched));
            } else {
                var words = parts[i].split(space);
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
        return steppers.run(limit)
    };
}();

console.log(limitTo(s, 100));
console.log(limitTo("Lucas Bortolaso <span class=\"highlight0\">Torri</span>", 100));
console.log(limitTo("cos, como prédios e <span class=\"highlight0\">torres</span>, a partir de diversas fotos. Estas técnicas foram implementadas", 130));
