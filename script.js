document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const polyInput = document.getElementById('poly-input');
    const calcBtn = document.getElementById('calc-btn');
    const presetBtn = document.getElementById('preset-btn');
    const resetBtn = document.getElementById('reset-btn');
    const errorContainer = document.getElementById('error-container');
    const errorMessage = document.getElementById('error-message');
    const initialFuncDisplay = document.getElementById('initial-func-display');
    const finalResultDisplay = document.getElementById('final-result-display');
    const stepsCard = document.getElementById('steps-card');
    const stepsContainer = document.getElementById('steps-container');

    // Satu tombol contoh yang mengisi fungsi standar secara otomatis
    presetBtn.addEventListener('click', () => {
        polyInput.value = '3x^4 + 2x^2 - 5x + 7';
        clearError();
        polyInput.focus();
    });

    // Event Listener Hitung Turunan
    calcBtn.addEventListener('click', calculate);

    // Event Enter Key pada kolom input
    polyInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            calculate();
        }
    });

    // Event Reset
    resetBtn.addEventListener('click', () => {
        polyInput.value = '';
        clearError();
        resetResultDisplays();
        polyInput.focus();
    });

    function clearError() {
        errorContainer.classList.add('hidden');
        errorMessage.textContent = '';
    }

    function showError(msg) {
        errorMessage.textContent = msg;
        errorContainer.classList.remove('hidden');
    }

    function resetResultDisplays() {
        initialFuncDisplay.textContent = 'f(x) = —';
        finalResultDisplay.textContent = 'f\'(x) = —';
        stepsCard.classList.add('hidden');
        stepsContainer.innerHTML = '';
        if (typeof Plotly !== 'undefined' && window.Plotly) {
            Plotly.purge('plotly-graph');
        }
    }

    function calculate() {
        clearError();
        const inputVal = polyInput.value;

        try {
            const parsedData = parsePolynomial(inputVal);
            const diffData = processDifferentiation(parsedData.rawTerms, parsedData.combinedTerms);
            
            // Render Hasil & Langkah Seketika
            renderResults(parsedData, diffData);
            plotGraph(parsedData.combinedTerms, diffData.finalTerms);
        } catch (err) {
            showError(err.message);
        }
    }

    /**
     * Parser fungsi polinomial dalam variabel x
     * Mengurai input string menjadi array suku { coeff, power } secara aman tanpa eval()
     */
    function parsePolynomial(expr) {
        if (!expr || expr.trim() === '') {
            throw new Error('Input tidak boleh kosong. Masukkan fungsi polinomial dalam x.');
        }

        const s = expr.trim();

        // Validasi karakter yang tidak didukung
        if (/[^xX0-9+\-*^.\s]/.test(s)) {
            throw new Error('Input mengandung karakter atau fungsi yang tidak didukung. Gunakan hanya variabel x dan operator (+, -, *, ^).');
        }

        const noSpace = s.replace(/\s+/g, '');

        // Validasi operator berurutan ilegal
        if (/[\^+\-*]{2,}/.test(noSpace)) {
            throw new Error('Format operator tidak valid (terdapat operator berurutan seperti "^^" atau "**").');
        }

        // Validasi operator di awal atau akhir ekspresi
        if (/[+\-*^]$/.test(noSpace) || /^[*^]/.test(noSpace)) {
            throw new Error('Format ekspresi tidak lengkap atau diawali/diakhiri oleh operator yang salah.');
        }

        // Tokenisasi
        const sStd = s.toLowerCase().replace(/\s+/g, '');
        let tokensStr = '';
        for (let i = 0; i < sStd.length; i++) {
            const ch = sStd[i];
            if ((ch === '+' || ch === '-') && i > 0) {
                const prev = sStd[i - 1];
                if (prev !== '+' && prev !== '-' && prev !== '*' && prev !== '^') {
                    tokensStr += ' ';
                }
            }
            tokensStr += ch;
        }

        const rawTokens = tokensStr.split(' ').filter(t => t.length > 0);
        const rawTerms = [];

        for (const token of rawTokens) {
            const caretCount = (token.match(/\^/g) || []).length;
            const starCount = (token.match(/\*/g) || []).length;

            if (caretCount > 1 || starCount > 1) {
                throw new Error(`Suku '${token}' memiliki format operator yang tidak valid.`);
            }

            let coeff, power;

            if (token.includes('^')) {
                const parts = token.split('^');
                const basePart = parts[0];
                const expPart = parts[1];

                if (!/^\d+$/.test(expPart)) {
                    if (expPart.startsWith('-')) throw new Error(`Pangkat negatif (${expPart}) tidak didukung.`);
                    if (expPart.includes('.')) throw new Error(`Pangkat desimal (${expPart}) tidak didukung.`);
                    throw new Error(`Pangkat '${expPart}' pada suku '${token}' tidak valid.`);
                }
                power = parseInt(expPart, 10);

                let coeffStr = '';
                if (basePart.endsWith('*x')) {
                    coeffStr = basePart.slice(0, -2);
                } else if (basePart.endsWith('x')) {
                    coeffStr = basePart.slice(0, -1);
                } else {
                    throw new Error(`Suku '${token}' tidak valid. Pangkat '^' harus diterapkan langsung pada variabel x.`);
                }

                if (coeffStr === '' || coeffStr === '+') coeff = 1;
                else if (coeffStr === '-') coeff = -1;
                else {
                    coeff = parseFloat(coeffStr);
                    if (isNaN(coeff)) throw new Error(`Koefisien '${coeffStr}' tidak valid.`);
                }
            } else {
                if (token.includes('x')) {
                    let coeffStr = '';
                    if (token.endsWith('*x')) {
                        coeffStr = token.slice(0, -2);
                    } else if (token.endsWith('x')) {
                        coeffStr = token.slice(0, -1);
                    } else {
                        throw new Error(`Format suku '${token}' tidak valid.`);
                    }

                    if (coeffStr === '' || coeffStr === '+') coeff = 1;
                    else if (coeffStr === '-') coeff = -1;
                    else {
                        coeff = parseFloat(coeffStr);
                        if (isNaN(coeff)) throw new Error(`Koefisien '${coeffStr}' tidak valid.`);
                    }
                    power = 1;
                } else {
                    coeff = parseFloat(token);
                    if (isNaN(coeff)) throw new Error(`Konstanta '${token}' tidak valid.`);
                    power = 0;
                }
            }

            rawTerms.push({ coeff, power, rawToken: token });
        }

        // Penggabungan suku sejenis
        const powerMap = new Map();
        rawTerms.forEach(term => {
            const currentCoeff = powerMap.get(term.power) || 0;
            powerMap.set(term.power, currentCoeff + term.coeff);
        });

        const sortedPowers = Array.from(powerMap.keys()).sort((a, b) => b - a);
        let combinedTerms = sortedPowers
            .map(p => ({ coeff: powerMap.get(p), power: p }))
            .filter(t => t.coeff !== 0);

        if (combinedTerms.length === 0) {
            combinedTerms = [{ coeff: 0, power: 0 }];
        }

        return { rawTerms, combinedTerms };
    }

    /**
     * Algoritma diferensiasi dan pembentukan pembahasan langkah demi langkah
     */
    function processDifferentiation(rawTerms, combinedTerms) {
        const stepDetails = [];
        const rawDerivedTerms = [];

        rawTerms.forEach(term => {
            const c = term.coeff;
            const n = term.power;
            let ruleUsed = '';
            let calculationExplanation = '';
            let derivedCoeff = 0;
            let derivedPower = 0;

            if (n === 0) {
                ruleUsed = 'Aturan Konstanta (d/dx [c] = 0)';
                derivedCoeff = 0;
                derivedPower = 0;
                calculationExplanation = `\\frac{d}{dx}(${formatSingleTermTex(c, n)}) = 0`;
            } else if (n === 1) {
                if (c === 1) {
                    ruleUsed = 'Turunan Variabel x (d/dx [x] = 1)';
                    derivedCoeff = 1;
                    derivedPower = 0;
                    calculationExplanation = `\\frac{d}{dx}(x) = 1`;
                } else {
                    ruleUsed = 'Aturan Fungsi Linear (d/dx [ax] = a)';
                    derivedCoeff = c;
                    derivedPower = 0;
                    calculationExplanation = `\\frac{d}{dx}(${formatSingleTermTex(c, n)}) = ${c}`;
                }
            } else {
                if (c === 1) {
                    ruleUsed = 'Aturan Pangkat (d/dx [xⁿ] = n · xⁿ⁻¹)';
                    derivedCoeff = n;
                    derivedPower = n - 1;
                    calculationExplanation = `\\frac{d}{dx}(x^{${n}}) = ${n} \\cdot x^{${n}-1} = ${formatSingleTermTex(derivedCoeff, derivedPower)}`;
                } else {
                    ruleUsed = 'Aturan Koefisien Konstanta & Pangkat (d/dx [a·xⁿ] = a · n · xⁿ⁻¹)';
                    derivedCoeff = c * n;
                    derivedPower = n - 1;
                    calculationExplanation = `\\frac{d}{dx}(${formatSingleTermTex(c, n)}) = ${c} \\cdot ${n}x^{${n}-1} = ${formatSingleTermTex(derivedCoeff, derivedPower)}`;
                }
            }

            rawDerivedTerms.push({
                origCoeff: c,
                origPower: n,
                coeff: derivedCoeff,
                power: derivedPower
            });

            stepDetails.push({
                termStr: formatSingleTerm(c, n, true),
                rule: ruleUsed,
                explanation: calculationExplanation,
                resultTerm: formatSingleTerm(derivedCoeff, derivedPower, true)
            });
        });

        // Gabungkan suku sejenis hasil turunan
        const powerMap = new Map();
        rawDerivedTerms.forEach(term => {
            if (term.coeff !== 0) {
                const currentCoeff = powerMap.get(term.power) || 0;
                powerMap.set(term.power, currentCoeff + term.coeff);
            }
        });

        const sortedPowers = Array.from(powerMap.keys()).sort((a, b) => b - a);
        let finalTerms = sortedPowers
            .map(p => ({ coeff: powerMap.get(p), power: p }))
            .filter(t => t.coeff !== 0);

        if (finalTerms.length === 0) {
            finalTerms = [{ coeff: 0, power: 0 }];
        }

        return {
            stepDetails,
            rawDerivedTerms,
            finalTerms,
            formattedFinal: formatPolynomialString(finalTerms, true)
        };
    }

    function formatPolynomialString(terms, useSuperscripts = true) {
        if (!terms || terms.length === 0 || (terms.length === 1 && terms[0].coeff === 0)) {
            return '0';
        }

        let res = '';
        terms.forEach((t, i) => {
            const c = t.coeff;
            const p = t.power;
            if (c === 0) return;

            const isInt = Number.isInteger(c);
            const absC = Math.abs(c);
            const cFormatted = isInt ? absC.toString() : absC.toFixed(2).replace(/\.?0+$/, '');

            let sign = c > 0 ? ' + ' : ' - ';
            if (i === 0) {
                sign = c > 0 ? '' : '-';
            }

            let termStr = '';
            if (p === 0) {
                termStr = cFormatted;
            } else if (p === 1) {
                termStr = (absC === 1) ? 'x' : `${cFormatted}x`;
            } else {
                const pFormatted = useSuperscripts ? toSuperscript(p) : `^${p}`;
                termStr = (absC === 1) ? `x${pFormatted}` : `${cFormatted}x${pFormatted}`;
            }

            res += sign + termStr;
        });

        return res || '0';
    }

    function formatSingleTerm(c, p, useSuperscripts = true) {
        if (c === 0) return '0';
        const isInt = Number.isInteger(c);
        const absC = Math.abs(c);
        const cFormatted = isInt ? absC.toString() : absC.toFixed(2).replace(/\.?0+$/, '');
        const sign = c < 0 ? '-' : '';

        if (p === 0) {
            return `${sign}${cFormatted}`;
        } else if (p === 1) {
            return (absC === 1) ? `${sign}x` : `${sign}${cFormatted}x`;
        } else {
            const pFormatted = useSuperscripts ? toSuperscript(p) : `^${p}`;
            return (absC === 1) ? `${sign}x${pFormatted}` : `${sign}${cFormatted}x${pFormatted}`;
        }
    }

    function formatSingleTermTex(c, p) {
        if (c === 0) return '0';
        const isInt = Number.isInteger(c);
        const absC = Math.abs(c);
        const cFormatted = isInt ? absC.toString() : absC.toFixed(2).replace(/\.?0+$/, '');
        const sign = c < 0 ? '-' : '';

        if (p === 0) return `${sign}${cFormatted}`;
        if (p === 1) return (absC === 1) ? `${sign}x` : `${sign}${cFormatted}x`;
        return (absC === 1) ? `${sign}x^{${p}}` : `${sign}${cFormatted}x^{${p}}`;
    }

    function toSuperscript(num) {
        const map = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
        return num.toString().split('').map(ch => map[ch] || ch).join('');
    }

    function evaluatePolynomial(terms, x) {
        return terms.reduce((acc, term) => {
            return acc + (term.coeff * Math.pow(x, term.power));
        }, 0);
    }

    /**
     * Menampilkan hasil ke elemen DOM secara langsung & Memicu Re-render MathJax
     */
    function renderResults(parsedData, diffData) {
        const formattedInitial = formatPolynomialString(parsedData.combinedTerms, true);
        initialFuncDisplay.textContent = `f(x) = ${formattedInitial}`;
        finalResultDisplay.textContent = `f'(x) = ${diffData.formattedFinal}`;

        // Buat Elemen Pembahasan Langkah demi Langkah
        stepsContainer.innerHTML = '';
        const wrapper = document.createDocumentFragment();

        // 1. Fungsi awal
        const step1Box = createStepBox(
            '1. Fungsi Awal & Identifikasi Suku',
            `Fungsi Awal: f(x) = ${formattedInitial}\n` +
            `Suku-suku yang teridentifikasi:\n` +
            parsedData.rawTerms.map((t, idx) => `• Suku ke-${idx + 1}: ${formatSingleTerm(t.coeff, t.power, true)} (Koefisien: ${t.coeff}, Pangkat: ${t.power})`).join('\n')
        );
        wrapper.appendChild(step1Box);

        // 2. Perhitungan per suku
        const step2Box = document.createElement('div');
        step2Box.className = 'step-box';
        
        const step2Title = document.createElement('h4');
        step2Title.className = 'step-title';
        step2Title.textContent = '2. Aturan Turunan & Perhitungan Tiap Suku';
        step2Box.appendChild(step2Title);

        const rulesList = document.createElement('ul');
        rulesList.className = 'step-list';

        diffData.stepDetails.forEach((detail, idx) => {
            const li = document.createElement('li');
            li.className = 'step-item';

            const termHeading = document.createElement('strong');
            termHeading.textContent = `Suku ke-${idx + 1} [ ${detail.termStr} ]:`;
            
            const ruleText = document.createElement('div');
            ruleText.className = 'rule-badge';
            ruleText.textContent = detail.rule;

            const calcText = document.createElement('div');
            calcText.className = 'calc-detail';
            calcText.textContent = `Proses: $${detail.explanation}$`;

            li.appendChild(termHeading);
            li.appendChild(ruleText);
            li.appendChild(calcText);
            rulesList.appendChild(li);
        });

        step2Box.appendChild(rulesList);
        wrapper.appendChild(step2Box);

        // 3. Penggabungan & Penyederhanaan
        let intermediateStr = diffData.stepDetails.map(d => d.resultTerm).join(' + ').replace(/\+\s\-/g, '- ');
        if (!intermediateStr) intermediateStr = '0';

        const step3Box = createStepBox(
            '3. Penggabungan & Penyederhanaan Akhir',
            `Penggabungan turunan suku: f'(x) = ${intermediateStr}\n` +
            `Hasil akhir disederhanakan: f'(x) = ${diffData.formattedFinal}`
        );
        wrapper.appendChild(step3Box);

        stepsContainer.appendChild(wrapper);
        stepsCard.classList.remove('hidden');

        // Pemicu Re-render MathJax untuk Elemen Baru
        if (window.MathJax && MathJax.typesetPromise) {
            MathJax.typesetPromise([stepsContainer, initialFuncDisplay, finalResultDisplay]).catch((err) => console.error(err));
        }
    }

    function createStepBox(titleText, contentText) {
        const box = document.createElement('div');
        box.className = 'step-box';

        const title = document.createElement('h4');
        title.className = 'step-title';
        title.textContent = titleText;

        const content = document.createElement('p');
        content.className = 'step-text';
        content.textContent = contentText;

        box.appendChild(title);
        box.appendChild(content);
        return box;
    }

    /**
     * Visualisasi Grafik Koordinat Interaktif Menggunakan Plotly.js (Plotly.react)
     * Warna Hijau Mint (#2D7A58) untuk f(x) dan Biru Langit (#2B78C5) untuk f'(x)
     */
    function plotGraph(initialTerms, derivedTerms) {
        const graphDiv = document.getElementById('plotly-graph');

        // Penanganan jika pustaka Plotly gagal dimuat dari CDN
        if (typeof Plotly === 'undefined' || !window.Plotly) {
            graphDiv.innerHTML = '<div class="graph-fallback-msg">💡 Pustaka grafik Plotly.js belum tersambung (periksa koneksi internet). Hasil turunan dan langkah penyelesaian di atas tetap dihitung 100% akurat.</div>';
            return;
        }

        const xValues = [];
        const yInitial = [];
        const yDerived = [];

        // Hitung titik koordinat untuk interval x in [-5, 5] dengan resolusi step 0.1
        for (let x = -5; x <= 5.01; x += 0.1) {
            const xFixed = parseFloat(x.toFixed(2));
            xValues.push(xFixed);
            yInitial.push(evaluatePolynomial(initialTerms, xFixed));
            yDerived.push(evaluatePolynomial(derivedTerms, xFixed));
        }

        // Trace 1: Fungsi Asli f(x) - Hijau Mint Utama SetLab
        const trace1 = {
            x: xValues,
            y: yInitial,
            mode: 'lines',
            name: 'f(x) Awal',
            line: { 
                color: '#2D7A58',
                width: 2.8 
            }
        };

        // Trace 2: Turunan Pertama f'(x) - Biru Langit Utama SetLab
        const trace2 = {
            x: xValues,
            y: yDerived,
            mode: 'lines',
            name: "f'(x) Turunan",
            line: { 
                color: '#2B78C5',
                width: 2.8, 
                dash: 'dash' 
            }
        };

        const layout = {
            title: false,
            margin: { t: 10, r: 15, l: 35, b: 30 },
            hovermode: 'x unified',
            paper_bgcolor: '#FFFFFF',
            plot_bgcolor: '#FAFCFB',
            xaxis: {
                title: false,
                zeroline: true,
                zerolinecolor: '#26352F',
                zerolinewidth: 1.2,
                gridcolor: '#E8F2EC',
                tickfont: { size: 10, color: '#718078' }
            },
            yaxis: {
                title: false,
                autorange: true, // Auto-reset skala Y agar kurva baru selalu proporsional
                zeroline: true,
                zerolinecolor: '#26352F',
                zerolinewidth: 1.2,
                gridcolor: '#E8F2EC',
                tickfont: { size: 10, color: '#718078' }
            },
            legend: {
                orientation: 'h',
                y: 1.12,
                x: 0.05,
                font: { size: 11, color: '#26352F' }
            }
        };

        const config = {
            responsive: true,
            displayModeBar: false
        };

        // Menggunakan Plotly.react() agar grafik diperbarui secara reaktif tanpa glitch
        Plotly.react('plotly-graph', [trace1, trace2], layout, config);
    }
});