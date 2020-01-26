import React from 'react';

function Grid(props) {

    // Returns a random 5x5 board, using the official letter distribution.
    // prettier-ignore
    const dice = ["AAAFRS", "AAEEEE", "AAFIRS", "ADENNN", "AEEEEM",
        "AEEGMU", "AEGMNN", "AFIRSY", "BJKQXZ", "CCNSTW",
        "CEIILT", "CEILPT", "CEIPST", "DHHNOT", "DHHLOR",
        "DHLNOR", "DDLNOR", "EIIITT", "EMOTTT", "ENSSSU",
        "FIPRSY", "GORRVW", "HIPRRY", "NOOTUW", "OOOTTU"];
    let chars = dice.map(cube => cube[Math.floor(Math.random() * cube.length)]);
    chars.sort(() => Math.random() - 0.5); // Shuffle the letters.
    const SIZE = 5;
    let grid = [];
    for (let row = 0; row < SIZE; row++) {
        grid[row] = [];
        for (let col = 0; col < SIZE; ++col) {
            grid[row][col] = chars[SIZE * row + col];
            if (grid[row][col] === "Q") grid[row][col] = "Qu";
        }
    }
    console.log(grid);
    console.log(grid[0][0]);
    return (<>
        <table>
            <tbody>
            <tr>
                <td>
                    { grid[0][0] }
                </td>
                <td>
                    { grid[0][1] }
                </td>
                <td>
                    { grid[0][2] }
                </td>
                <td>
                    { grid[0][3] }
                </td>
                <td>
                    { grid[0][4] }
                </td>
            </tr>
            <tr>
                <td>
                    { grid[1][0] }
                </td>
                <td>
                    { grid[1][1] }
                </td>
                <td>
                    { grid[1][2] }
                </td>
                <td>
                    { grid[1][3] }
                </td>
                <td>
                    { grid[1][4] }
                </td>
            </tr>
            <tr>
                <td>
                    { grid[2][0] }
                </td>
                <td>
                    { grid[2][1] }
                </td>
                <td>
                    { grid[2][2] }
                </td>
                <td>
                    { grid[2][3] }
                </td>
                <td>
                    { grid[2][4] }
                </td>
            </tr>
            <tr>
                <td>
                    { grid[3][0] }
                </td>
                <td>
                    { grid[3][1] }
                </td>
                <td>
                    { grid[3][2] }
                </td>
                <td>
                    { grid[3][3] }
                </td>
                <td>
                    { grid[3][4] }
                </td>
            </tr>
            <tr>
                <td>
                    { grid[4][0] }
                </td>
                <td>
                    { grid[4][1] }
                </td>
                <td>
                    { grid[4][2] }
                </td>
                <td>
                    { grid[4][3] }
                </td>
                <td>
                    { grid[4][4] }
                </td>
            </tr>
            </tbody>
        </table>
    </>);
}

export default Grid;