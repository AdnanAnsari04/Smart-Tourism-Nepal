using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartTourism.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddTourismManagementFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // ---------- Destinations ----------
            migrationBuilder.AddColumn<string>(
                name: "District",
                table: "Destinations",
                type: "nvarchar(120)",
                maxLength: 120,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BestSeason",
                table: "Destinations",
                type: "nvarchar(150)",
                maxLength: 150,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EntryInformation",
                table: "Destinations",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true);

            // ---------- Hotels ----------
            migrationBuilder.DropForeignKey(
                name: "FK_Hotels_Destinations_DestinationId",
                table: "Hotels");

            migrationBuilder.AlterColumn<int>(
                name: "DestinationId",
                table: "Hotels",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Hotels_Destinations_DestinationId",
                table: "Hotels",
                column: "DestinationId",
                principalTable: "Destinations",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddColumn<string>(
                name: "HotelType",
                table: "Hotels",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "Hotels",
                type: "nvarchar(300)",
                maxLength: 300,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Latitude",
                table: "Hotels",
                type: "decimal(9,6)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Longitude",
                table: "Hotels",
                type: "decimal(9,6)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ContactPhone",
                table: "Hotels",
                type: "nvarchar(30)",
                maxLength: 30,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Website",
                table: "Hotels",
                type: "nvarchar(300)",
                maxLength: 300,
                nullable: true);

            // ---------- TrekkingRoutes ----------
            migrationBuilder.AddColumn<string>(
                name: "District",
                table: "TrekkingRoutes",
                type: "nvarchar(120)",
                maxLength: 120,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StartingPoint",
                table: "TrekkingRoutes",
                type: "nvarchar(150)",
                maxLength: 150,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EndingPoint",
                table: "TrekkingRoutes",
                type: "nvarchar(150)",
                maxLength: 150,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Latitude",
                table: "TrekkingRoutes",
                type: "decimal(9,6)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Longitude",
                table: "TrekkingRoutes",
                type: "decimal(9,6)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Rating",
                table: "TrekkingRoutes",
                type: "decimal(3,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddCheckConstraint(
                name: "CK_TrekkingRoute_Rating",
                table: "TrekkingRoutes",
                sql: "[Rating] >= 0 AND [Rating] <= 5");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // ---------- TrekkingRoutes ----------
            migrationBuilder.DropCheckConstraint(
                name: "CK_TrekkingRoute_Rating",
                table: "TrekkingRoutes");

            migrationBuilder.DropColumn(name: "District", table: "TrekkingRoutes");
            migrationBuilder.DropColumn(name: "StartingPoint", table: "TrekkingRoutes");
            migrationBuilder.DropColumn(name: "EndingPoint", table: "TrekkingRoutes");
            migrationBuilder.DropColumn(name: "Latitude", table: "TrekkingRoutes");
            migrationBuilder.DropColumn(name: "Longitude", table: "TrekkingRoutes");
            migrationBuilder.DropColumn(name: "Rating", table: "TrekkingRoutes");

            // ---------- Hotels ----------
            migrationBuilder.DropColumn(name: "HotelType", table: "Hotels");
            migrationBuilder.DropColumn(name: "Address", table: "Hotels");
            migrationBuilder.DropColumn(name: "Latitude", table: "Hotels");
            migrationBuilder.DropColumn(name: "Longitude", table: "Hotels");
            migrationBuilder.DropColumn(name: "ContactPhone", table: "Hotels");
            migrationBuilder.DropColumn(name: "Website", table: "Hotels");

            migrationBuilder.DropForeignKey(
                name: "FK_Hotels_Destinations_DestinationId",
                table: "Hotels");

            migrationBuilder.AlterColumn<int>(
                name: "DestinationId",
                table: "Hotels",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Hotels_Destinations_DestinationId",
                table: "Hotels",
                column: "DestinationId",
                principalTable: "Destinations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            // ---------- Destinations ----------
            migrationBuilder.DropColumn(name: "District", table: "Destinations");
            migrationBuilder.DropColumn(name: "BestSeason", table: "Destinations");
            migrationBuilder.DropColumn(name: "EntryInformation", table: "Destinations");
        }
    }
}
