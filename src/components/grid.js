import React from 'react';

function Grid(props) {

    const grid = props.grid;

    return (<>
        {grid ?
        (<table style={{display: 'inline-block'}}>
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
        </table>) : (<div>Loading Grid!</div>)}
    </>);
}

export default Grid;