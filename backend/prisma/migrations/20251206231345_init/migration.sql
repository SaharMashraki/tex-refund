BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Users] (
    [id] INT NOT NULL IDENTITY(1,1),
    [email] NVARCHAR(1000) NOT NULL,
    [password_hash] NVARCHAR(1000) NOT NULL,
    [full_name] NVARCHAR(1000) NOT NULL,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [Users_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Users_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Users_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[Documents] (
    [id] INT NOT NULL IDENTITY(1,1),
    [user_id] INT NOT NULL,
    [storage_path] NVARCHAR(1000) NOT NULL,
    [status] NVARCHAR(1000) NOT NULL,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [Documents_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL CONSTRAINT [Documents_updated_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Documents_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Tags] (
    [id] INT NOT NULL IDENTITY(1,1),
    [key] NVARCHAR(1000) NOT NULL,
    [label_en] NVARCHAR(1000) NOT NULL,
    [label_he] NVARCHAR(1000) NOT NULL,
    [category] NVARCHAR(1000) NOT NULL,
    [is_system] BIT NOT NULL CONSTRAINT [Tags_is_system_df] DEFAULT 0,
    CONSTRAINT [Tags_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Tags_key_key] UNIQUE NONCLUSTERED ([key])
);

-- CreateTable
CREATE TABLE [dbo].[DocumentTags] (
    [document_id] INT NOT NULL,
    [tag_id] INT NOT NULL,
    [confidence] FLOAT(53) NOT NULL,
    CONSTRAINT [DocumentTags_pkey] PRIMARY KEY CLUSTERED ([document_id],[tag_id])
);

-- CreateTable
CREATE TABLE [dbo].[Payments] (
    [id] INT NOT NULL IDENTITY(1,1),
    [user_id] INT NOT NULL,
    [document_id] INT NOT NULL,
    [stripe_session_id] NVARCHAR(1000) NOT NULL,
    [amount] DECIMAL(10,2) NOT NULL,
    [currency] NVARCHAR(1000) NOT NULL,
    [status] NVARCHAR(1000) NOT NULL,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [Payments_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Payments_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Documents] ADD CONSTRAINT [Documents_user_id_fkey] FOREIGN KEY ([user_id]) REFERENCES [dbo].[Users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DocumentTags] ADD CONSTRAINT [DocumentTags_document_id_fkey] FOREIGN KEY ([document_id]) REFERENCES [dbo].[Documents]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DocumentTags] ADD CONSTRAINT [DocumentTags_tag_id_fkey] FOREIGN KEY ([tag_id]) REFERENCES [dbo].[Tags]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Payments] ADD CONSTRAINT [Payments_user_id_fkey] FOREIGN KEY ([user_id]) REFERENCES [dbo].[Users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Payments] ADD CONSTRAINT [Payments_document_id_fkey] FOREIGN KEY ([document_id]) REFERENCES [dbo].[Documents]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
