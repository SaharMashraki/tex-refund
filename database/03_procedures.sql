-- 03_procedures.sql
-- Stored Procedures

CREATE PROCEDURE sp_CompletePayment
    @StripeSessionId VARCHAR(255),
    @UserId INT,
    @DocumentId INT,
    @Amount DECIMAL(10, 2),
    @Currency VARCHAR(10)
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRANSACTION;

    BEGIN TRY
        -- 1. Insert Payment Record
        INSERT INTO Payments (user_id, document_id, stripe_session_id, amount, currency, status)
        VALUES (@UserId, @DocumentId, @StripeSessionId, @Amount, @Currency, 'COMPLETED');

        -- 2. Update Document Status to PAID
        UPDATE Documents
        SET status = 'PAID', updated_at = GETDATE()
        WHERE id = @DocumentId;

        -- Commit Transaction
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        -- Rollback if error occurs
        ROLLBACK TRANSACTION;
        
        -- Re-throw error
        THROW;
    END CATCH
END;
