var stemmer = new Snowball('Russian');

function BM25() {
    this.terms = {};
    this.documents = {};

    this.k1 = 1.5;
    this.b = 0.5;

    this.totalDocuments = 0;
    this.totalDocumentTermLength = 0;
    return this;
}


BM25.Tokenize = function (text) {
    return text
        .toLowerCase()
        .replace(/[^A-Za-zа-яА-ЯёЁ0-9_]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ')
        .map(function (a) {
            stemmer.setCurrent(a);
            stemmer.stem();
            return stemmer.getCurrent();
        });
};

BM25.prototype.addDocument = function (doc) {

    if (typeof doc._id === 'undefined') {
        throw new Error(1000, 'ID is a required property of documents.');
    }

    if (typeof doc.body === 'undefined') {
        throw new Error(1001, 'Body is a required property of documents.');
    }

    // Raw tokenized list of words
    var tokens = BM25.Tokenize(doc.body);

    // Will hold unique terms and their counts and frequencies
    var _terms = {};

    // docObj will eventually be added to the documents database
    var docObj = {id: doc._id, tokens: tokens, body: doc.body};

    // Count number of terms
    docObj.termCount = tokens.length;

    // Increment totalDocuments
    this.totalDocuments++;

    // Readjust averageDocumentLength
    this.totalDocumentTermLength += docObj.termCount;
    this.averageDocumentLength = this.totalDocumentTermLength / this.totalDocuments;

    // Calculate term frequency
    // First get terms count
    for (var i = 0, len = tokens.length; i < len; i++) {
        var term = tokens[i];
        if (!_terms[term]) {
            _terms[term] = {
                count: 0,
                freq: 0
            };
        }
        ;
        _terms[term].count++;
    }

    // Then re-loop to calculate term frequency.
    // We'll also update inverse document frequencies here.
    var keys = Object.keys(_terms);
    for (var i = 0, len = keys.length; i < len; i++) {
        var term = keys[i];
        // Term Frequency for this document.
        _terms[term].freq = _terms[term].count / docObj.termCount;

        // Inverse Document Frequency initialization
        if (!this.terms[term]) {
            this.terms[term] = {
                n: 0, // Number of docs this term appears in, uniquely
                idf: 0
            };
        }

        this.terms[term].n++;
    }
    ;

    // Calculate inverse document frequencies
    // This is SLOWish so if you want to index a big batch of documents,
    // comment this out and run it once at the end of your addDocuments run
    // If you're only indexing a document or two at a time you can leave this in.
    this.updateIdf();

    // Add docObj to docs db
    docObj.terms = _terms;
    this.documents[docObj._id] = docObj;
};

BM25.prototype.updateIdf = function () {
    var keys = Object.keys(this.terms);
    for (var i = 0, len = keys.length; i < len; i++) {
        var term = keys[i];
        var num = (this.totalDocuments - this.terms[term].n + 0.5);
        var denom = (this.terms[term].n + 0.5);
        this.terms[term]._idf = Math.max(Math.log10(num / denom), 0.01);
    }
};

BM25.prototype.search = function (query) {

    var queryTerms = BM25.Tokenize(query);
    var results = [];

    // Look at each document in turn. There are better ways to do this with inverted indices.
    var keys = Object.keys(this.documents);
    for (var j = 0, nDocs = keys.length; j < nDocs; j++) {
        var id = keys[j];
        // The relevance score for a document is the sum of a tf-idf-like
        // calculation for each query term.
        this.documents[id]._score = 0;

        // Calculate the score for each query term
        for (var i = 0, len = queryTerms.length; i < len; i++) {
            var queryTerm = queryTerms[i];

            // We've never seen this term before so IDF will be 0.
            // Means we can skip the whole term, it adds nothing to the score
            // and isn't in any document.
            if (typeof this.terms[queryTerm] === 'undefined') {
                continue;
            }

            // This term isn't in the document, so the TF portion is 0 and this
            // term contributes nothing to the search score.
            if (typeof this.documents[id].terms[queryTerm] === 'undefined') {
                continue;
            }

            // The term is in the document, let's go.
            // The whole term is :
            // IDF * (TF * (k1 + 1)) / (TF + k1 * (1 - b + b * docLength / avgDocLength))


            // IDF is pre-calculated for the whole docset.
            var idf = this.terms[queryTerm]._idf;
            // Numerator of the TF portion.
            var num = this.documents[id].terms[queryTerm].count * (this.k1 + 1);

            // Denomerator of the TF portion.
            var denom = this.documents[id].terms[queryTerm].count
                + (this.k1 * (1 - this.b + (this.b * this.documents[id].termCount / this.averageDocumentLength)));

            // Add this query term to the score
            this.documents[id]._score += idf * num / denom;
        }

        if (!isNaN(this.documents[id]._score) && this.documents[id]._score > 0) {
            results.push(this.documents[id]);
        }
    }

    //results.sort(function(a, b) { return b._score - a._score; });
    results.sort(function (a, b) {
        return b._id - a._id;
    });
    return results[0] && results[0]._id || -1;
};


/*!
 * Snowball JavaScript Library v0.3
 * http://code.google.com/p/urim/
 * http://snowball.tartarus.org/
 *
 * Copyright 2010, Oleg Mazko
 * http://www.mozilla.org/MPL/
 */
function Snowball(N) {
    function a(v, n, q, m) {
        this.s_size = v.length;
        this.s = this.toCharArray(v);
        this.substring_i = n;
        this.result = q;
        this.method = m
    }

    function G() {
        var v;
        return {
            b: 0, k: 0, l: 0, c: 0, lb: 0, s_c: function (n) {
                v = n;
                this.c = 0;
                this.l = n.length;
                this.lb = 0;
                this.b = this.c;
                this.k = this.l
            }, g_c: function () {
                var n = v;
                v = null;
                return n
            }, i_g: function (n, q, m) {
                if (this.c < this.l) {
                    var s = v.charCodeAt(this.c);
                    if (s <= m && s >= q) {
                        s -= q;
                        if (n[s >> 3] & 1 << (s & 7)) {
                            this.c++;
                            return true
                        }
                    }
                }
                return false
            }, i_g_b: function (n, q, m) {
                if (this.c > this.lb) {
                    var s = v.charCodeAt(this.c -
                        1);
                    if (s <= m && s >= q) {
                        s -= q;
                        if (n[s >> 3] & 1 << (s & 7)) {
                            this.c--;
                            return true
                        }
                    }
                }
                return false
            }, o_g: function (n, q, m) {
                if (this.c < this.l) {
                    var s = v.charCodeAt(this.c);
                    if (s > m || s < q) {
                        this.c++;
                        return true
                    }
                    s -= q;
                    if (!(n[s >> 3] & 1 << (s & 7))) {
                        this.c++;
                        return true
                    }
                }
                return false
            }, o_g_b: function (n, q, m) {
                if (this.c > this.lb) {
                    var s = v.charCodeAt(this.c - 1);
                    if (s > m || s < q) {
                        this.c--;
                        return true
                    }
                    s -= q;
                    if (!(n[s >> 3] & 1 << (s & 7))) {
                        this.c--;
                        return true
                    }
                }
                return false
            }, e_s: function (n, q) {
                if (this.l - this.c < n)return false;
                for (var m = 0; m < n; m++)if (v.charCodeAt(this.c +
                        m) != q.charCodeAt(m))return false;
                this.c += n;
                return true
            }, e_s_b: function (n, q) {
                if (this.c - this.lb < n)return false;
                for (var m = 0; m < n; m++)if (v.charCodeAt(this.c - n + m) != q.charCodeAt(m))return false;
                this.c -= n;
                return true
            }, f_a: function (n, q) {
                for (var m = 0, s = q, z = this.c, w = this.l, i = 0, x = 0, j = false; ;) {
                    for (var y = m + (s - m >> 1), A = 0, B = i < x ? i : x, g = n[y], h = B; h < g.s_size; h++) {
                        if (z + B == w) {
                            A = -1;
                            break
                        }
                        if (A = v.charCodeAt(z + B) - g.s[h])break;
                        B++
                    }
                    if (A < 0) {
                        s = y;
                        x = B
                    } else {
                        m = y;
                        i = B
                    }
                    if (s - m <= 1) {
                        if (m > 0 || s == m || j)break;
                        j = true
                    }
                }
                for (; ;) {
                    g = n[m];
                    if (i >= g.s_size) {
                        this.c =
                            z + g.s_size;
                        if (!g.method)return g.result;
                        m = g.method();
                        this.c = z + g.s_size;
                        if (m)return g.result
                    }
                    m = g.substring_i;
                    if (m < 0)return 0
                }
            }, f_a_b: function (n, q) {
                for (var m = 0, s = q, z = this.c, w = this.lb, i = 0, x = 0, j = false; ;) {
                    for (var y = m + (s - m >> 1), A = 0, B = i < x ? i : x, g = n[y], h = g.s_size - 1 - B; h >= 0; h--) {
                        if (z - B == w) {
                            A = -1;
                            break
                        }
                        if (A = v.charCodeAt(z - 1 - B) - g.s[h])break;
                        B++
                    }
                    if (A < 0) {
                        s = y;
                        x = B
                    } else {
                        m = y;
                        i = B
                    }
                    if (s - m <= 1) {
                        if (m > 0 || s == m || j)break;
                        j = true
                    }
                }
                for (; ;) {
                    g = n[m];
                    if (i >= g.s_size) {
                        this.c = z - g.s_size;
                        if (!g.method)return g.result;
                        m = g.method();
                        this.c = z -
                            g.s_size;
                        if (m)return g.result
                    }
                    m = g.substring_i;
                    if (m < 0)return 0
                }
            }, r_s: function (n, q, m) {
                var s = m.length - (q - n), z = v.substring(0, n), w = v.substring(q);
                v = z + m + w;
                this.l += s;
                if (this.c >= q)this.c += s; else if (this.c > n)this.c = n;
                return s
            }, s_ch: function () {
                if (this.b < 0 || this.b > this.k || this.k > this.l || this.l > v.length)throw"faulty slice operation";
            }, s_f: function (n) {
                this.s_ch();
                this.r_s(this.b, this.k, n)
            }, s_d: function () {
                this.s_f("")
            }, i_: function (n, q, m) {
                q = this.r_s(n, q, m);
                if (n <= this.b)this.b += q;
                if (n <= this.k)this.k += q
            }, s_t: function () {
                this.s_ch();
                return v.substring(this.b, this.k)
            }, e_v_b: function (n) {
                return this.e_s_b(n.length, n)
            }
        }
    }

    a.prototype.toCharArray = function (v) {
        for (var n = v.length, q = Array(n), m = 0; m < n; m++)q[m] = v.charCodeAt(m);
        return q
    };
    return new ({
        RussianStemmer: function () {
            function v() {
                for (; !k.i_g(B, 1072, 1103);) {
                    if (k.c >= k.l)return false;
                    k.c++
                }
                return true
            }

            function n() {
                for (; !k.o_g(B, 1072,
                    1103);) {
                    if (k.c >= k.l)return false;
                    k.c++
                }
                return true
            }

            function q(r, t) {
                var d;
                k.k = k.c;
                if (d = k.f_a_b(r, t)) {
                    k.b = k.c;
                    switch (d) {
                        case 1:
                            d = k.l - k.c;
                            if (!k.e_s_b(1, "\u0430")) {
                                k.c = k.l - d;
                                if (!k.e_s_b(1, "\u044f"))return false
                            }
                        case 2:
                            k.s_d()
                    }
                    return true
                }
                return false
            }

            function m(r, t) {
                var d;
                k.k = k.c;
                if (d = k.f_a_b(r, t)) {
                    k.b = k.c;
                    d == 1 && k.s_d();
                    return true
                }
                return false
            }

            var s = [new a("\u0432", -1, 1), new a("\u0438\u0432", 0, 2), new a("\u044b\u0432", 0, 2), new a("\u0432\u0448\u0438", -1, 1), new a("\u0438\u0432\u0448\u0438", 3, 2), new a("\u044b\u0432\u0448\u0438",
                3, 2), new a("\u0432\u0448\u0438\u0441\u044c", -1, 1), new a("\u0438\u0432\u0448\u0438\u0441\u044c", 6, 2), new a("\u044b\u0432\u0448\u0438\u0441\u044c", 6, 2)], z = [new a("\u0435\u0435", -1, 1), new a("\u0438\u0435", -1, 1), new a("\u043e\u0435", -1, 1), new a("\u044b\u0435", -1, 1), new a("\u0438\u043c\u0438", -1, 1), new a("\u044b\u043c\u0438", -1, 1), new a("\u0435\u0439", -1, 1), new a("\u0438\u0439", -1, 1), new a("\u043e\u0439", -1, 1), new a("\u044b\u0439", -1, 1), new a("\u0435\u043c", -1, 1), new a("\u0438\u043c", -1, 1), new a("\u043e\u043c",
                -1, 1), new a("\u044b\u043c", -1, 1), new a("\u0435\u0433\u043e", -1, 1), new a("\u043e\u0433\u043e", -1, 1), new a("\u0435\u043c\u0443", -1, 1), new a("\u043e\u043c\u0443", -1, 1), new a("\u0438\u0445", -1, 1), new a("\u044b\u0445", -1, 1), new a("\u0435\u044e", -1, 1), new a("\u043e\u044e", -1, 1), new a("\u0443\u044e", -1, 1), new a("\u044e\u044e", -1, 1), new a("\u0430\u044f", -1, 1), new a("\u044f\u044f", -1, 1)], w = [new a("\u0435\u043c", -1, 1), new a("\u043d\u043d", -1, 1), new a("\u0432\u0448", -1, 1), new a("\u0438\u0432\u0448", 2, 2), new a("\u044b\u0432\u0448",
                2, 2), new a("\u0449", -1, 1), new a("\u044e\u0449", 5, 1), new a("\u0443\u044e\u0449", 6, 2)], i = [new a("\u0441\u044c", -1, 1), new a("\u0441\u044f", -1, 1)], x = [new a("\u043b\u0430", -1, 1), new a("\u0438\u043b\u0430", 0, 2), new a("\u044b\u043b\u0430", 0, 2), new a("\u043d\u0430", -1, 1), new a("\u0435\u043d\u0430", 3, 2), new a("\u0435\u0442\u0435", -1, 1), new a("\u0438\u0442\u0435", -1, 2), new a("\u0439\u0442\u0435", -1, 1), new a("\u0435\u0439\u0442\u0435", 7, 2), new a("\u0443\u0439\u0442\u0435", 7, 2), new a("\u043b\u0438", -1, 1), new a("\u0438\u043b\u0438",
                10, 2), new a("\u044b\u043b\u0438", 10, 2), new a("\u0439", -1, 1), new a("\u0435\u0439", 13, 2), new a("\u0443\u0439", 13, 2), new a("\u043b", -1, 1), new a("\u0438\u043b", 16, 2), new a("\u044b\u043b", 16, 2), new a("\u0435\u043c", -1, 1), new a("\u0438\u043c", -1, 2), new a("\u044b\u043c", -1, 2), new a("\u043d", -1, 1), new a("\u0435\u043d", 22, 2), new a("\u043b\u043e", -1, 1), new a("\u0438\u043b\u043e", 24, 2), new a("\u044b\u043b\u043e", 24, 2), new a("\u043d\u043e", -1, 1), new a("\u0435\u043d\u043e", 27, 2), new a("\u043d\u043d\u043e", 27,
                1), new a("\u0435\u0442", -1, 1), new a("\u0443\u0435\u0442", 30, 2), new a("\u0438\u0442", -1, 2), new a("\u044b\u0442", -1, 2), new a("\u044e\u0442", -1, 1), new a("\u0443\u044e\u0442", 34, 2), new a("\u044f\u0442", -1, 2), new a("\u043d\u044b", -1, 1), new a("\u0435\u043d\u044b", 37, 2), new a("\u0442\u044c", -1, 1), new a("\u0438\u0442\u044c", 39, 2), new a("\u044b\u0442\u044c", 39, 2), new a("\u0435\u0448\u044c", -1, 1), new a("\u0438\u0448\u044c", -1, 2), new a("\u044e", -1, 2), new a("\u0443\u044e", 44, 2)], j = [new a("\u0430", -1, 1), new a("\u0435\u0432",
                -1, 1), new a("\u043e\u0432", -1, 1), new a("\u0435", -1, 1), new a("\u0438\u0435", 3, 1), new a("\u044c\u0435", 3, 1), new a("\u0438", -1, 1), new a("\u0435\u0438", 6, 1), new a("\u0438\u0438", 6, 1), new a("\u0430\u043c\u0438", 6, 1), new a("\u044f\u043c\u0438", 6, 1), new a("\u0438\u044f\u043c\u0438", 10, 1), new a("\u0439", -1, 1), new a("\u0435\u0439", 12, 1), new a("\u0438\u0435\u0439", 13, 1), new a("\u0438\u0439", 12, 1), new a("\u043e\u0439", 12, 1), new a("\u0430\u043c", -1, 1), new a("\u0435\u043c", -1, 1), new a("\u0438\u0435\u043c", 18,
                1), new a("\u043e\u043c", -1, 1), new a("\u044f\u043c", -1, 1), new a("\u0438\u044f\u043c", 21, 1), new a("\u043e", -1, 1), new a("\u0443", -1, 1), new a("\u0430\u0445", -1, 1), new a("\u044f\u0445", -1, 1), new a("\u0438\u044f\u0445", 26, 1), new a("\u044b", -1, 1), new a("\u044c", -1, 1), new a("\u044e", -1, 1), new a("\u0438\u044e", 30, 1), new a("\u044c\u044e", 30, 1), new a("\u044f", -1, 1), new a("\u0438\u044f", 33, 1), new a("\u044c\u044f", 33, 1)], y = [new a("\u043e\u0441\u0442", -1, 1), new a("\u043e\u0441\u0442\u044c", -1, 1)], A = [new a("\u0435\u0439\u0448\u0435",
                -1, 1), new a("\u043d", -1, 2), new a("\u0435\u0439\u0448", -1, 1), new a("\u044c", -1, 3)], B = [33, 65, 8, 232], g, h, k = new G;
            this.setCurrent = function (r) {
                k.s_c(r)
            };
            this.getCurrent = function () {
                return k.g_c()
            };
            this.stem = function () {
                g = h = k.l;
                if (v()) {
                    h = k.c;
                    if (n())if (v())if (n())g = k.c
                }
                k.c = k.l;
                if (k.c < h)return false;
                k.lb = h;
                if (!q(s, 9)) {
                    k.c = k.l;
                    if (!m(i, 2))k.c = k.l;
                    var r;
                    if (m(z, 26)) {
                        q(w, 8);
                        r = true
                    } else r = false;
                    if (!r) {
                        k.c = k.l;
                        if (!q(x, 46)) {
                            k.c = k.l;
                            m(j, 36)
                        }
                    }
                }
                k.c = k.l;
                k.k = k.c;
                if (k.e_s_b(1, "\u0438")) {
                    k.b = k.c;
                    k.s_d()
                } else k.c = k.l;
                k.k =
                    k.c;
                if (r = k.f_a_b(y, 2)) {
                    k.b = k.c;
                    g <= k.c && r == 1 && k.s_d()
                }
                k.c = k.l;
                k.k = k.c;
                if (r = k.f_a_b(A, 4)) {
                    k.b = k.c;
                    switch (r) {
                        case 1:
                            k.s_d();
                            k.k = k.c;
                            if (!k.e_s_b(1, "\u043d"))break;
                            k.b = k.c;
                        case 2:
                            if (!k.e_s_b(1, "\u043d"))break;
                        case 3:
                            k.s_d()
                    }
                }
                return true
            }
        }
    }[N.substring(0, 1).toUpperCase() + N.substring(1).toLowerCase() +
    "Stemmer"])
};
