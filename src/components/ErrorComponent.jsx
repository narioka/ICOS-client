import React from 'react'

/**
 * システムエラー時のcomponnt
 */
export default class ErrorComponent extends React.Component {

    render() {
        return (
            <div className="error">
                管理者にお問い合わせください。
            </div>
        )
    }
}